// src/app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  PutCommand, 
  ScanCommand, 
  UpdateCommand, 
  DeleteCommand 
} from "@aws-sdk/lib-dynamodb";
import { docClient } from '@/app/lib/dynamoClient';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'InventoryItems';

// GET - Retrieve all inventory items
export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME
    });

    const { Items } = await docClient.send(command);
    return NextResponse.json(Items || [], { status: 200 });
  } catch (error) {
    console.error('Inventory Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' }, 
      { status: 500 }
    );
  }
}

// POST - Add a new inventory item
export async function POST(request: NextRequest) {
  try {
    const { itemName, quantity, price } = await request.json();

    // Input validation
    if (!itemName || quantity === undefined || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ItemID: uuidv4(), // Generate unique ID
        ItemName: itemName,
        Quantity: Number(quantity),
        Price: Number(price)
      }
    });

    await docClient.send(command);
    return NextResponse.json(
      { message: 'Item added successfully' }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Add Item Error:', error);
    return NextResponse.json(
      { error: 'Failed to add item' }, 
      { status: 500 }
    );
  }
}

// PUT - Update an existing inventory item
export async function PUT(request: NextRequest) {
  try {
    const { ItemID, itemName, quantity, price } = await request.json();

    if (!ItemID) {
      return NextResponse.json(
        { error: 'ItemID is required' }, 
        { status: 400 }
      );
    }

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { ItemID },
      UpdateExpression: 
        'SET ItemName = :name, Quantity = :qty, Price = :price',
      ExpressionAttributeValues: {
        ':name': itemName,
        ':qty': Number(quantity),
        ':price': Number(price)
      }
    });

    await docClient.send(command);
    return NextResponse.json(
      { message: 'Item updated successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Item Error:', error);
    return NextResponse.json(
      { error: 'Failed to update item' }, 
      { status: 500 }
    );
  }
}

// DELETE - Remove an inventory item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ItemID = searchParams.get('ItemID');

    if (!ItemID) {
      return NextResponse.json(
        { error: 'ItemID is required' }, 
        { status: 400 }
      );
    }

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { ItemID }
    });

    await docClient.send(command);
    return NextResponse.json(
      { message: 'Item deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete Item Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' }, 
      { status: 500 }
    );
  }
}