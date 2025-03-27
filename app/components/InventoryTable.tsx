// src/components/InventoryTable.tsx
'use client';

import React, { useState } from 'react';

interface InventoryItem {
  ItemID: string;
  ItemName: string;
  Quantity: number;
  Price: number;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: InventoryItem) => void;
}

export default function InventoryTable({ 
  items, 
  onDeleteItem, 
  onEditItem 
}: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.ItemID}>
              <td className="border p-2">{item.ItemName}</td>
              <td className="border p-2 text-right">{item.Quantity}</td>
              <td className="border p-2 text-right">
                ${item.Price.toFixed(2)}
              </td>
              <td className="border p-2 text-center">
                <button 
                  onClick={() => onEditItem(item)}
                  className="mr-2 bg-yellow-500 text-white p-1 rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteItem(item.ItemID)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}