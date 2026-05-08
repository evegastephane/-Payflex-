import { useCallback, useEffect, useState } from 'react';

import { getNotifications, type PayflexNotification } from '@/services/payflex/notifications';

type UseNotificationsResult = {
  data: PayflexNotification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useNotifications(): UseNotificationsResult {
  const [data, setData] = useState<PayflexNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getNotifications();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

