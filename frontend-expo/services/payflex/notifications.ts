import { api } from '@/services/api/client';

export type NotificationKind = 'payment' | 'security' | 'info';

export type PayflexNotification = {
  id: string;
  kind: NotificationKind;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  // Extra metadata so future deep-links can be implemented.
  meta?: {
    transactionId?: string;
  };
};

// Replace the mock with a real backend call later.
export async function getNotifications(): Promise<PayflexNotification[]> {
  // If there's no backend configured, we keep using mock data.
  if (!process.env.EXPO_PUBLIC_API_URL) {
    return [
      {
        id: 'n1',
        kind: 'payment',
        icon: 'checkmark-circle',
        iconColor: '#34C759',
        title: 'Paiement réussi',
        description: 'Votre paiement de 15€ à Netflix a été traité.',
        timestamp: '5 min',
        isUnread: true,
        meta: { transactionId: 't1' },
      },
      {
        id: 'n2',
        kind: 'security',
        icon: 'lock-closed',
        iconColor: '#FF3B30',
        title: 'Alerte de sécurité',
        description: 'Une connexion a été détectée sur un nouvel appareil.',
        timestamp: 'Hier à 14h30',
        isUnread: true,
      },
      {
        id: 'n3',
        kind: 'payment',
        icon: 'close-circle',
        iconColor: '#FF3B30',
        title: 'Échec de la transaction',
        description: "Votre paiement de 5€ à Spotify n'a pas pu être traité.",
        timestamp: '2 jours',
        isUnread: false,
        meta: { transactionId: 't2' },
      },
      {
        id: 'n4',
        kind: 'info',
        icon: 'sparkles',
        iconColor: '#007AFF',
        title: 'Nouveauté !',
        description: 'Vous pouvez désormais payer sur Amazon avec votre compte.',
        timestamp: '3 jours',
        isUnread: false,
      },
      {
        id: 'n5',
        kind: 'info',
        icon: 'notifications',
        iconColor: '#FF9500',
        title: 'Rappel',
        description:
          "N'oubliez pas de vérifier votre identité pour débloquer toutes les fonctionnalités.",
        timestamp: '5 jours',
        isUnread: false,
      },
    ];
  }

  // Example API shape (adjust when backend is ready):
  // const res = await api.get('/notifications');
  // return res.data.notifications;
  const res = await api.get('/notifications');
  return res.data.notifications as PayflexNotification[];
}

