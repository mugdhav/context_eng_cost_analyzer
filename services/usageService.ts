
const STORAGE_KEY = 'gemini_usage_history';

// Limits for Gemini 2.5 Flash Free Tier
// Note: These are conservative client-side checks. The API is the final source of truth.
const LIMITS = {
  RPD: 1500, // Requests per day
  RPM: 15,   // Requests per minute
};

interface UsageRecord {
  timestamp: number;
  tokens: number;
}

const getHistory = (): UsageRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history: UsageRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const checkUsageLimit = (): boolean => {
  const history = getHistory();
  const now = Date.now();
  
  // Filter for time windows
  const lastMinute = history.filter(r => now - r.timestamp < 60000);
  const lastDay = history.filter(r => now - r.timestamp < 24 * 60 * 60 * 1000);

  // Check RPM (Requests Per Minute)
  if (lastMinute.length >= LIMITS.RPM) {
    return false;
  }

  // Check RPD (Requests Per Day)
  if (lastDay.length >= LIMITS.RPD) {
    return false;
  }
  
  return true;
};

export const recordUsage = (tokens: number) => {
  const history = getHistory();
  const now = Date.now();
  
  // Prune history older than 24 hours to keep storage clean
  const activeHistory = history.filter(r => now - r.timestamp < 24 * 60 * 60 * 1000);
  
  activeHistory.push({ timestamp: now, tokens });
  saveHistory(activeHistory);
};
