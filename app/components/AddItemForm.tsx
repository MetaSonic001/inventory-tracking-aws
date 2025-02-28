'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddItemForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ItemName: '',
    Quantity: 0,
    Price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add item');
      
      setFormData({ ItemName: '', Quantity: 0, Price: 0 });
      router.refresh();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="ItemName" className="block text-sm font-medium text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          id="ItemName"
          value={formData.ItemName}
          onChange={(e) => setFormData({ ...formData, ItemName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="Quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          id="Quantity"
          value={formData.Quantity}
          onChange={(e) => setFormData({ ...formData, Quantity: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="Price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="Price"
          value={formData.Price}
          onChange={(e) => setFormData({ ...formData, Price: parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          min="0"
          step="0.01"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add Item
      </button>
    </form>
  );
}
