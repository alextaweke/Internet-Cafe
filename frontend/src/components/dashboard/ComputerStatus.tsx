// components/computer/ComputerStatus.tsx
import type { Computer } from '../../types/types';
import Button from '../common/Button';

type ComputerStatusProps = {
  computer: Computer;
  onStartSession: (id: number) => void;
  onEndSession: (id: number) => void;
  onDeleteComputer: (id: number) => void;
};

const ComputerStatus = ({ 
  computer, 
  onStartSession, 
  onEndSession,
  onDeleteComputer 
}: ComputerStatusProps) => {
  const isAvailable = computer.status === 'available';
  const isInUse = computer.status === 'in-use';
  const isMaintenance = computer.status === 'maintenance';

  return (
    <div
      className={`p-4 rounded-lg border relative ${
        isInUse
          ? 'bg-red-100 border-red-300'
          : isMaintenance
          ? 'bg-yellow-100 border-yellow-300'
          : 'bg-green-100 border-green-300'
      }`}
    >
      {/* Delete button (top-right corner) */}
      <button
        onClick={() => onDeleteComputer(computer.id)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-lg font-bold"
        title="Delete Computer"
      >
        ×
      </button>

      <h4 className="font-medium pr-4">{computer.name || `PC-${computer.id}`}</h4>
      <p>Status: {computer.status}</p>
      <p>Rate: {computer.hourlyRate} birr/hr</p>
      
      {isAvailable ? (
        <Button
          onClick={() => onStartSession(computer.id)}
          className="mt-2"
          variant="primary"
        >
          Start Session
        </Button>
      ) : isInUse ? (
        <Button
          onClick={() => onEndSession(computer.id)}
          className="mt-2"
          variant="danger"
        >
          End Session
        </Button>
      ) : null}
    </div>
  );
};

export default ComputerStatus;