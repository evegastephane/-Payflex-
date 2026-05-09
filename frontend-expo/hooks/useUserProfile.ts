import { useCallback, useEffect, useState } from 'react';

import {
  getUserProfile,
  setBiometricEnabled,
  type PayflexUserProfile,
} from '@/services/payflex/profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<PayflexUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getUserProfile();
      setProfile(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement profil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const updateBiometric = useCallback(async (value: boolean) => {
    // Optimistic update (nice UX even when API is slow).
    setProfile((prev) => (prev ? { ...prev, biometricEnabled: value } : prev));
    try {
      await setBiometricEnabled(value);
    } catch {
      // Rollback if backend fails.
      setProfile((prev) => (prev ? { ...prev, biometricEnabled: !value } : prev));
    }
  }, []);

  return { profile, isLoading, error, refetch: fetchProfile, updateBiometric };
}

