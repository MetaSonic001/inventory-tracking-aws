import { getAllItems } from '@/app/lib/dynamodb';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';

export default async function Home() {
  const items = await getAllItems();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <AddItemForm />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
          <InventoryTable items={items} />
        </div>
      </div>
    </main>
  );
}