import { useState, useEffect } from 'react';
import { getComputers, startSession, endSession } from '../api/computer.api';
import type { Computer } from '../types/types'; // <-- make sure this path is correct

const useComputers = () => {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComputers = async () => {
    try {
      const data = await getComputers();
      setComputers(data);
    } catch (err) {
      setError('Failed to fetch computers');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (computerId: number, user?: string) => {
  if (!computerId || isNaN(computerId)) {
    setError('Invalid computer selected');
    return;
  }

  try {
    await startSession(computerId, user);
    await fetchComputers();
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to start session');
  }
};


  const handleEndSession = async (computerId: number) => {
    try {
      const result = await endSession(computerId);
      await fetchComputers();
      return result;
    } catch (err) {
      setError('Failed to end session');
    }
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  return {
    computers,
    loading,
    error,
    startSession: handleStartSession,
    endSession: handleEndSession,
    refreshComputers: fetchComputers,
  };
};

export default useComputers;
