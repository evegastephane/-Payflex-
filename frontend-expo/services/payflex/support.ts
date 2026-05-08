import { api } from '@/services/api/client';

export type SupportFaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export async function getSupportFaq(): Promise<SupportFaqItem[]> {
  if (!process.env.EXPO_PUBLIC_API_URL) {
    return [
      {
        id: 'f1',
        category: 'Gestion du Compte',
        question: 'Comment modifier mes informations personnelles ?',
        answer:
          "Pour modifier vos informations personnelles, allez dans l'onglet \"Profil\" et sélectionnez \"Informations personnelles\". Vous pourrez y mettre à jour votre nom, numéro de téléphone et autres informations.",
      },
      {
        id: 'f2',
        category: 'Paiements',
        question: 'Pourquoi ma transaction a-t-elle échoué ?',
        answer:
          'Les transactions peuvent échouer pour plusieurs raisons : fonds insuffisants, problème technique, ou informations de paiement incorrectes. Vérifiez votre solde et réessayez. Si le problème persiste, contactez notre support.',
      },
      {
        id: 'f3',
        category: 'Sécurité',
        question: "Comment activer l'authentification biométrique ?",
        answer:
          'Allez dans "Paramètres" > "Sécurité" et activez l\'option "Authentification biométrique". Vous devrez scanner votre empreinte digitale ou votre visage selon les capacités de votre appareil.',
      },
      {
        id: 'f4',
        category: 'Gestion du Compte',
        question: "Comment changer ma langue ?",
        answer:
          'Dans les paramètres, sélectionnez "Langue" pour choisir votre langue préférée. L\'application sera automatiquement mise à jour.',
      },
      {
        id: 'f5',
        category: 'Paiements',
        question: 'Quels sont les frais de transaction ?',
        answer:
          'Les frais de transaction varient selon le type de paiement et le montant. Consultez notre grille tarifaire dans la section "Paiements" pour plus de détails.',
      },
      {
        id: 'f6',
        category: 'Sécurité',
        question: 'Que faire en cas de perte de mon téléphone ?',
        answer:
          'En cas de perte de votre téléphone, contactez immédiatement notre support pour bloquer votre compte. Vous pouvez également vous connecter depuis un autre appareil pour sécuriser votre compte.',
      },
    ];
  }

  const res = await api.get('/support/faq');
  return res.data.faq as SupportFaqItem[];
}

