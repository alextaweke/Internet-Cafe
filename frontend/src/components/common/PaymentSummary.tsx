import { useEffect, useState } from 'react';

interface PaymentSummaryProps {
  duration: number;
  rate: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PaymentSummary = ({ duration, rate, onConfirm, onCancel }: PaymentSummaryProps) => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Calculate amount when duration changes
    const hours = duration / 60;
    setAmount(parseFloat((hours * rate).toFixed(2)));
  }, [duration, rate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Session Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{Math.round(duration)} minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Rate:</span>
            <span>{rate.toFixed(2)} birr/hour</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>{amount.toFixed(2)} birr</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};