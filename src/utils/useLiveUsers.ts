import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/quiz';

interface LiveUsersData {
  count: number;
  latestUser: { username: string; avatar: string } | null;
  isLoading: boolean;
}

export function useLiveUsers() {
  const [data, setData] = useState<LiveUsersData>({
    count: 3,
    latestUser: null,
    isLoading: true,
  });

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/users/count');
      if (res.ok) {
        const json = await res.json();
        setData((prev) => ({
          count: typeof json.count === 'number' ? json.count : prev.count,
          latestUser: json.latestUser || prev.latestUser,
          isLoading: false,
        }));
      }
    } catch {
      // offline fallback
      setData((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchCount();

    // Setup live SSE stream for real-time automatic updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/users/stream');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (typeof payload.count === 'number') {
            setData({
              count: payload.count,
              latestUser: payload.latestUser || null,
              isLoading: false,
            });
          }
        } catch {
          // ignore parsing error
        }
      };

      eventSource.onerror = () => {
        // SSE error, will auto-reconnect or fallback to interval
      };
    } catch {
      // EventSource not supported
    }

    // Polling backup every 8 seconds
    const interval = setInterval(fetchCount, 8000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
    };
  }, [fetchCount]);

  const registerUser = useCallback(async (user: UserProfile) => {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          coins: user.coins,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof json.count === 'number') {
          setData((prev) => ({
            ...prev,
            count: json.count,
            latestUser: { username: user.username, avatar: user.avatar },
          }));
        }
      }
    } catch {
      // offline fallback
    }
  }, []);

  return {
    userCount: data.count,
    latestUser: data.latestUser,
    isLoading: data.isLoading,
    registerUser,
    refreshCount: fetchCount,
  };
}
