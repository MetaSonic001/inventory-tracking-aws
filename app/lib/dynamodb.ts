import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const TABLE_NAME = 'Inventory';

export async function getAllItems() {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

export async function addItem(item: Omit<InventoryItem, 'ItemID' | 'CreatedAt' | 'UpdatedAt'>) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ItemID: Date.now().toString(),
      ...item,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamodb.put(params).promise();
    return params.Item;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
}

export async function updateItem(
  itemId: string,
  updates: Partial<Omit<InventoryItem, 'ItemID' | 'CreatedAt' | 'UpdatedAt'>>
) {
  const updateExpressions = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value]) => {
    updateExpressions.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = value;
  });

  const params = {
    TableName: TABLE_NAME,
    Key: { ItemID: itemId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}, #UpdatedAt = :updatedAt`,
    ExpressionAttributeNames: {
      ...expressionAttributeNames,
      '#UpdatedAt': 'UpdatedAt',
    },
    ExpressionAttributeValues: {
      ...expressionAttributeValues,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}
