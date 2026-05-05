import { useState, useEffect } from 'react';
import type { ClientProfile } from '../types/agency';

const STORAGE_KEY = 'nexus_client_profile';

export function useClientProfile() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const saveProfile = (data: ClientProfile) => {
    const withTimestamp = { ...data, completedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp));
    setProfile(withTimestamp);
  };

  const clearProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  return { profile, loading, saveProfile, clearProfile };
}
