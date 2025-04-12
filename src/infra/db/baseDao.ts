import { CosmosClient, Container } from '@azure/cosmos';
import { CONFIG } from '../../config';

// baese class data access object to create cozmos client and have common util functions
export class BaseDao<T> {
  protected client: CosmosClient;
  protected container: Container;
  protected partitionKey: string;

  constructor(containerId: string, partitionKey: string) {
    this.client = new CosmosClient(CONFIG.cosmos.connectionString);
    const databaseId = CONFIG.cosmos.database;
    this.container = this.client.database(databaseId).container(containerId);
    this.partitionKey = partitionKey;
  }

  async getData(itemId: string, includeDeleted: boolean = false) {
    try {
      const { resource: data } = await this.container.item(itemId, this.partitionKey).read();
      if (includeDeleted) {
        return data;
      }
      return data && data.deleted ? null : data;
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  }

  async createData(item: any) {
    try {
      const { resource } = await this.container.items.create(item);
      return resource;
    } catch (error) {
      console.error('Error creating data:', error);
      throw error;
    }
  }

  async updateData(itemId: string, updates: any) {
    try {
      const doc: import('@azure/cosmos').PatchRequestBody = [];
      for (const key in updates) {
        if (key && key !== 'id') {
          doc.push({
            op: 'add',
            path: `/${key}`,
            value: updates[key] === undefined ? null : updates[key],
          });
        }
      }

      const { resource } = await this.container.item(itemId, this.partitionKey).patch(doc);
      return resource;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  async softDelete(itemId: string) {
    try {
      const data = await this.updateData(itemId, { deleted: true });
      return data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  async findByQuery(querySpec: any) {
    try {
      const { resources } = await this.container.items.query<T>(querySpec).fetchAll();
      return resources;
    } catch (error) {
      console.error('Error finding by query:', error);
      throw error;
    }
  }
}
