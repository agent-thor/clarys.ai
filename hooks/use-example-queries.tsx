import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface ExampleQuery {
  query: string;
  response: {
    analysis?: string;
    accountability_analysis?: string;
    answer?: string;
  };
}

export interface InitiateData {
  'accountability-check': ExampleQuery[];
  'extract-with-proposals': ExampleQuery[];
  'general-chat': ExampleQuery[];
}

export function useExampleQueries() {
  const { data: session } = useSession();
  const [exampleQueries, setExampleQueries] = useState<InitiateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExampleQueries = async () => {
    if (!session?.user?.email) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/initiate', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch example queries: ${response.status}`);
      }

      const data = await response.json();
      setExampleQueries(data);
      console.log('✅ [USE_EXAMPLE_QUERIES] Fetched example queries:', data);
    } catch (err) {
      console.error('❌ [USE_EXAMPLE_QUERIES] Error fetching example queries:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchExampleQueries();
    }
  }, [session?.user?.email]);

  const getQueriesForSection = (section: 'accountability-check' | 'extract-with-proposals' | 'general-chat'): ExampleQuery[] => {
    return exampleQueries?.[section] || [];
  };

  return {
    exampleQueries,
    loading,
    error,
    refetch: fetchExampleQueries,
    getQueriesForSection,
  };
}
