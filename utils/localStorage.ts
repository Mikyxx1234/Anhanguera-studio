export const FORM_SUBMITTED_KEY = 'anhanguera_form_submitted';
export const FORM_TIMESTAMP_KEY = 'anhanguera_form_timestamp';

export const setFormSubmitted = (): void => {
  const timestamp = Date.now();
  localStorage.setItem(FORM_SUBMITTED_KEY, 'true');
  localStorage.setItem(FORM_TIMESTAMP_KEY, timestamp.toString());
};

export const isFormSubmitted = (): boolean => {
  const submitted = localStorage.getItem(FORM_SUBMITTED_KEY);
  const timestamp = localStorage.getItem(FORM_TIMESTAMP_KEY);
  
  if (!submitted || !timestamp) {
    return false;
  }
  
  // Check if 24 hours have passed (86400000 ms = 24 hours)
  const now = Date.now();
  const formTime = parseInt(timestamp);
  const hoursPassed = (now - formTime) / (1000 * 60 * 60);
  
  return hoursPassed < 24;
};

export const clearFormStatus = (): void => {
  localStorage.removeItem(FORM_SUBMITTED_KEY);
  localStorage.removeItem(FORM_TIMESTAMP_KEY);
};

export const getTimeRemaining = (): string => {
  const timestamp = localStorage.getItem(FORM_TIMESTAMP_KEY);
  
  if (!timestamp) return '';
  
  const formTime = parseInt(timestamp);
  const now = Date.now();
  const timeLeft = 24 * 60 * 60 * 1000 - (now - formTime);
  
  if (timeLeft <= 0) return '';
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m restantes para receber os preços`;
};