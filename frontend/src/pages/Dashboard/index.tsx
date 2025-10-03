import { useEffect, useState } from 'react';
import { getComputers, addComputer, deleteComputer } from '../../api/computer.api';
import type { Computer, Report, Session } from '../../types/types';
import { startSession, endSession } from '../../api/session.api';
import { getDailyReport } from '../../api/report.api';
import ComputerStatus from '../../components/dashboard/ComputerStatus';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const DashboardPage = () => {
   const [] = useState(false);

  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState<Report | null>(null);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [computerToDelete, setComputerToDelete] = useState<number | null>(null);
  const [showAddComputerConfirm, setShowAddComputerConfirm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    computerId: number | null;
    amount: number;
    duration: number;
  }>({ computerId: null, amount: 0, duration: 0 });

  // Fetch computers & report
  const fetchData = async () => {
    try {
      const [computersData, reportData] = await Promise.all([
        getComputers(),
        getDailyReport(new Date().toISOString().split('T')[0])
      ]);
      setComputers(computersData);
      setReportData(reportData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Start session
  const handleStartSession = async (_computerId: number) => {
    try {
      if (!selectedComputer) return;
      await startSession(selectedComputer.id, customerName || 'Anonymous');
      await fetchData();
      setSelectedComputer(null);
      setCustomerName('');
    } catch (err) {
      setError('Failed to start session');
    }
  };

  // End session
  const handleEndSession = async (computerId: number) => {
    try {
      const result: Session & { durationMinutes?: number } = await endSession(computerId);
      const amount = result.totalAmount ?? 0;
      const duration = result.durationMinutes ?? 0;
      
      // Show payment confirmation instead of alert
      setPaymentInfo({
        computerId,
        amount,
        duration
      });
      
    } catch (err) {
      setError('Failed to end session');
    }
  };

  // Confirm payment and close session
  const handleConfirmPayment = async () => {
    try {
      await fetchData(); // Refresh data
      setPaymentInfo({ computerId: null, amount: 0, duration: 0 }); // Close modal
    } catch (err) {
      setError('Failed to confirm payment');
    }
  };

  // Continue session
  const handleContinueSession = () => {
    setPaymentInfo({ computerId: null, amount: 0, duration: 0 }); // Just close the modal
  };

  // Add computer with "pc-N" naming
  const handleAddComputer = async () => {
    try {
      // Extract numbers from computer names like pc-1, pc-2, ...
      const numbers = computers
        .map(c => {
          const match = c.name?.match(/pc-(\d+)$/i);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => n > 0);

      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      const name = `pc-${nextNumber}`;

      await addComputer(name, 25); // default rate 25 birr/hr
      await fetchData();
      setShowAddComputerConfirm(false); // Close the confirmation dialog
    } catch (err) {
      setError('Failed to add computer');
    }
  };

  // Delete computer
  const handleDeleteComputer = async (computerId: number) => {
    try {
      await deleteComputer(computerId);
      await fetchData();
      setComputerToDelete(null);
    } catch (err) {
      setError('Failed to delete computer');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Computers</h3>
          <p className="text-3xl font-bold">{computers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold">
            {computers.filter(c => c.status === 'in-use').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Today's Revenue</h3>
          <p className="text-3xl font-bold">
            {(reportData?.totalAmount ?? 0).toFixed(2)} birr
          </p>
        </div>
      </div>

      {/* Computer status + Add button + daily revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Computer status list */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
            Computer Status
            <button
              onClick={() => setShowAddComputerConfirm(true)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              title="Add Computer"
            >
              + Add Computer
            </button>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {computers.map(computer => (
              <ComputerStatus
                key={computer.id}
                computer={computer}
                onStartSession={() => setSelectedComputer(computer)}
                onEndSession={() => handleEndSession(computer.id)}
                onDeleteComputer={() => setComputerToDelete(computer.id)}
              />
            ))}
          </div>
        </div>

        {/* Daily revenue chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Daily Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData?.chartData ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Revenue (birr)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Start session modal */}
      {selectedComputer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              Start Session on {selectedComputer.name || `Computer #${selectedComputer.id}`}
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
              <button
                onClick={() => setSelectedComputer(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStartSession(selectedComputer.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {computerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this computer? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setComputerToDelete(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComputer(computerToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add computer confirmation modal */}
      {showAddComputerConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Add Computer</h3>
            <p className="mb-4">Are you sure you want to add a new computer?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddComputerConfirm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComputer}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment confirmation modal */}
      {paymentInfo.computerId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Session Summary</h3>
            <div className="mb-4 space-y-2">
              <p className="text-lg">
                Duration: <span className="font-bold">{Math.round(paymentInfo.duration)} minutes</span>
              </p>
              <p className="text-lg">
                Total Amount: <span className="font-bold">{paymentInfo.amount.toFixed(2)} birr</span>
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleContinueSession}
                className="px-4 py-2 border rounded"
              >
                Continue Session
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Pay & End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};