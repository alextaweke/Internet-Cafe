/**
 * Calculates duration between two dates in minutes
 * @param startTime Start time of the session
 * @param endTime End time of the session
 * @returns Duration in minutes
 */
export const calculateDuration = (startTime: Date, endTime: Date): number => {
  if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
    throw new Error('Both startTime and endTime must be Date objects');
  }
  
  const durationMs = endTime.getTime() - startTime.getTime();
  return Math.max(0, durationMs / (1000 * 60)); // Ensure non-negative value
};

/**
 * Calculates the cost based on duration and hourly rate
 * @param minutes Duration in minutes
 * @param hourlyRate Rate per hour in birr
 * @returns Calculated cost in birr
 */
export const calculateCost = (minutes: number, hourlyRate: number): number => {
  if (minutes < 0) throw new Error('Duration cannot be negative');
  if (hourlyRate < 0) throw new Error('Hourly rate cannot be negative');
  
  const hours = minutes / 60;
  const cost = hours * hourlyRate;
  return parseFloat(cost.toFixed(2)); // Round to 2 decimal places
};

/**
 * Formats duration for display (e.g., "2h 15m")
 * @param minutes Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours}h ${mins}m`;
};

/**
 * Formats currency for display (e.g., "25.00 birr")
 * @param amount Amount in birr
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} birr`;
};

/**
 * Checks if a session is currently active
 * @param session Session object
 * @returns True if session is active
 */
export const isSessionActive = (session: { endTime: Date | null }): boolean => {
  return session.endTime === null;
};

/**
 * Gets the current duration of an active session in minutes
 * @param session Session object with startTime
 * @returns Current duration in minutes
 */
export const getCurrentDuration = (session: { startTime: Date }): number => {
  return calculateDuration(session.startTime, new Date());
};