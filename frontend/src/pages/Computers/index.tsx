import { useState } from 'react';
import ComputerStatus from '../../components/dashboard/ComputerStatus';
import useComputers from '../../hooks/useComputers';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const ComputersPage = () => {
  const { computers, loading, error, startSession, endSession } = useComputers();
  const [selectedComputer, setSelectedComputer] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');

  const handleStart = async (computerId: number | null) => {
  if (computerId === null) return;

  try {
    await startSession(computerId, customerName || 'Anonymous');
  } catch (err) {
    console.error("Failed to start session:", err);
  }

  setSelectedComputer(null);
  setCustomerName('');
};

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Computer Management</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {computers.map((computer) => (
          <ComputerStatus
            key={computer.id}
            computer={computer}
            onStartSession={() => setSelectedComputer(computer.id)}
            onEndSession={endSession} onDeleteComputer={function (): void {
              throw new Error('Function not implemented.');
            } }          />
        ))}
      </div>

      {selectedComputer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              Start Session on Computer #{selectedComputer}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Customer Name (optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Anonymous"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setSelectedComputer(null)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
  onClick={() => {
    if (selectedComputer !== null) {
      handleStart(selectedComputer);
    }
  }}
  variant="primary"
>
  Start Session
</Button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputersPage;