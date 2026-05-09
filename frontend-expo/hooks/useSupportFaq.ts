import { useCallback, useEffect, useState } from 'react';

import { getSupportFaq, type SupportFaqItem } from '@/services/payflex/support';

export function useSupportFaq() {
  const [data, setData] = useState<SupportFaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getSupportFaq();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement FAQ');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  };
}

