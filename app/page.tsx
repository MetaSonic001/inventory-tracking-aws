// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import InventoryForm from '@/app/components/InventoryForm';
import InventoryTable from '@/app/components/InventoryTable';

interface InventoryItem {
  ItemID: string;
  ItemName: string;
  Quantity: number;
  Price: number;
}

export default function Home() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);

  // Fetch inventory items
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
      alert('Failed to load inventory');
    }
  };

  // Add new item
  const handleAddItem = async (newItem: {
    itemName: string, 
    quantity: number, 
    price: number
  }) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem 
        ? { ...newItem, ItemID: editingItem.ItemID }
        : newItem;

      const response = await fetch('/api/inventory', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchInventoryItems();
        setEditingItem(undefined);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add/update item');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/inventory?ItemID=${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchInventoryItems();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Inventory Tracking System
      </h1>
      
      <InventoryForm 
        onAddItem={handleAddItem}
        initialData={editingItem}
      />
      
      <InventoryTable 
        items={items}
        onDeleteItem={handleDeleteItem}
        onEditItem={setEditingItem}
      />
    </>
  );
}