import { api } from '@/services/api/client';

export type PayflexUserProfile = {
  name: string;
  phone: string;
  biometricEnabled: boolean;
};

export async function getUserProfile(): Promise<PayflexUserProfile> {
  if (!process.env.EXPO_PUBLIC_API_URL) {
    return {
      name: 'Amara Koné',
      phone: '+225 01 23 45 67 89',
      biometricEnabled: true,
    };
  }

  const res = await api.get('/user/profile');
  return res.data.profile as PayflexUserProfile;
}

export async function setBiometricEnabled(value: boolean): Promise<void> {
  if (!process.env.EXPO_PUBLIC_API_URL) return;
  await api.post('/user/security/biometric', { enabled: value });
}

