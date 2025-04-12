import { CosmosClient, Container } from '@azure/cosmos';
import { CONFIG } from './config';

export class CosmosDB {
  private readonly client: CosmosClient;
  private readonly container: Container;

  constructor(containerId: 'users' | 'ci' | 'di') {
    this.client = new CosmosClient(CONFIG.cosmos.connectionString);
    const databaseId = CONFIG.cosmos.database;
    this.container = this.client.database(databaseId).container(containerId);
  }

  async getData(itemId: string, partitionKey: string) {
    try {
      const { resource } = await this.container.item(itemId, partitionKey).read();
      return resource;
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

  async updateData(itemId: string, partitionKey: string, updatedItem: any) {
    try {
      const { resource } = await this.container.item(itemId, partitionKey).replace(updatedItem);
      return resource;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }
}
