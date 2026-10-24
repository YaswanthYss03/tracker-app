// Settings the server sends to the app (GET /app/config): Google sign-in
// client, support contacts, versions. Cached for the session.
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

export type AppConfig = {
  minVersion: string;
  latestVersion: string;
  googleWebClientId: string | null;
  support: { email?: string; phone?: string; whatsapp?: string; address?: string };
};

export function useAppConfig() {
  const { data } = useQuery({
    queryKey: ['app-config'],
    queryFn: () => api<{ data: AppConfig }>('/app/config', { auth: false }),
    staleTime: 60 * 60_000,
    retry: 1,
  });
  return data?.data ?? null;
}
