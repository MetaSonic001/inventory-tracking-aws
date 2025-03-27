// src/components/InventoryForm.tsx
'use client';

import React, { useState, FormEvent, useEffect } from 'react';

interface InventoryFormProps {
  onAddItem: (item: {
    itemName: string, 
    quantity: number, 
    price: number
  }) => void;
  initialData?: {
    ItemID?: string;
    ItemName: string;
    Quantity: number;
    Price: number;
  };
}

export default function InventoryForm({ 
  onAddItem, 
  initialData 
}: InventoryFormProps) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setItemName(initialData.ItemName);
      setQuantity(initialData.Quantity);
      setPrice(initialData.Price);
    } else {
      // Reset form when no initial data
      setItemName('');
      setQuantity(0);
      setPrice(0);
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!itemName || quantity < 0 || price < 0) {
      alert('Please fill all fields correctly');
      return;
    }

    onAddItem({ itemName, quantity, price });
    
    // Reset form if not editing
    if (!initialData) {
      setItemName('');
      setQuantity(0);
      setPrice(0);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mb-4 p-4 border rounded"
    >
      <div className="mb-2">
        <label className="block">Item Name</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="0"
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min="0"
          step="0.01"
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded"
      >
        {initialData ? 'Update Item' : 'Add Item'}
      </button>
    </form>
  );
}