import dotenv from 'dotenv';

dotenv.config();

import { CosmosDB } from '../src/database';

describe('CosmosDB Class Tests', function () {
  const containerId = 'users';
  const cosmosDB = new CosmosDB(containerId);

  it('should create an item successfully', async function () {
    const newItem = {
      id: 'testItem',
      partitionKey: 'testKey',
      data: 'Test Data',
    };
    const createdItem = await cosmosDB.createData(newItem);
    expect(createdItem).toHaveProperty('id', 'testItem');
    expect(createdItem).toHaveProperty('data', 'Test Data');
  });

  it.skip('should get an item successfully', async function () {
    const itemId = 'testItem';
    const partitionKey = 'testKey';
    const item = await cosmosDB.getData(itemId, partitionKey);
    expect(item).toBeInstanceOf(Object);
    expect(item).toHaveProperty('id', itemId);
  });

  it.skip('should update an item successfully', async function () {
    const itemId = 'testItem';
    const partitionKey = 'testKey';
    const item = await cosmosDB.getData(itemId, partitionKey);
    item.data = 'Updated Test Data';
    const updatedItem = await cosmosDB.updateData(itemId, partitionKey, item);
    expect(updatedItem).toHaveProperty('data', 'Updated Test Data');
  });

  // Consider adding more test cases as needed
});
