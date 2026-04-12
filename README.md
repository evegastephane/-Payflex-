# 💳 Payflex

Application de paiement mobile et web — FastAPI + PostgreSQL + Expo + Next.js

---

## 📋 Table des matières

- [Prérequis](#-prérequis)
- [Installation du projet](#-installation-du-projet)
- [Variables d'environnement](#-variables-denvironnement)
- [Commandes Git](#-commandes-git)
- [Lancer le projet](#-lancer-le-projet)

---

## 🛠 Prérequis

Avant de cloner le projet, chaque membre de l'équipe doit installer les outils suivants sur **Windows** :

### 1. Git
- Télécharger et installer : https://git-scm.com/download/win
- Vérifier l'installation :
  ```bash
  git --version
  ```

### 2. Docker Desktop
- Télécharger et installer : https://www.docker.com/products/docker-desktop
- Activer **WSL 2** lors de l'installation (Docker le propose automatiquement)
- Vérifier l'installation :
  ```bash
  docker --version
  docker compose version
  ```

### 3. Node.js (pour Expo et Next.js)
- Télécharger la version LTS : https://nodejs.org/
- Vérifier l'installation :
  ```bash
  node --version
  npm --version
  ```

### 4. Expo Go (sur téléphone)
- Android : https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS : https://apps.apple.com/app/expo-go/id982107779

### 5. Un IDE Jetbrains (recommandé)
- Télécharger : [https://code.visualstudio.com/](https://www.jetbrains.com/webstorm/)

---

## Installation du projet

### Étape 1 — Cloner le dépôt

Ouvrir un terminal (Git Bash ou PowerShell) et exécuter :

```bash
git clone https://github.com/evegastephane/-Payflex-
cd -Payflex-
```

### Étape 2 — Créer le fichier `.env`

Copier le fichier d'exemple et le remplir avec vos valeurs :

```bash
cp .env.example .env
```

> Ne jamais committer le fichier `.env` — il est déjà dans le `.gitignore`

### Étape 3 — Lancer le backend et la base de données

```bash
docker compose up --build
```

Cela démarre automatiquement :
- **FastAPI** → http://localhost:8000
- **PostgreSQL** → port 5432
- **Adminer (UI base de données)** → http://localhost:8080

### Étape 4 — Lancer le frontend Next.js

```bash
cd frontend-next
npm install
npm run dev
```

Next.js sera disponible sur → http://localhost:3000

### Étape 5 — Lancer le frontend Expo

```bash
cd frontend-expo
npm install
npx expo start
```

Scanner le QR code avec l'application **Expo Go** sur votre téléphone.

> Dans le code Expo, remplacer `localhost` par l'**IP de votre machine** :
> ```typescript
> const API_URL = "http://192.168.X.X:8000"; // votre IP locale
> ```
> Pour trouver votre IP sur Windows : ouvrir un terminal et taper `ipconfig`

---

## Variables d'environnement

Créer un fichier `.env` à la **racine du projet** avec les variables suivantes :

```env
# Base de données
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=payflex

# URL de connexion (utilisée par FastAPI)
DATABASE_URL=postgresql+asyncpg://postgres:votre_mot_de_passe@db:5432/payflex

# Backend
SECRET_KEY=une_cle_secrete_longue_et_aleatoire
```

> Demander les valeurs réelles au chef de projet — ne jamais les partager publiquement.

---

## Commandes Git

### Configuration initiale (à faire une seule fois)

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### Workflow quotidien

```bash
# 1. Toujours commencer par récupérer les dernières modifications
git pull origin dev

# 2. Créer une branche pour votre fonctionnalité
git checkout -b feature/nom-de-la-feature

# 3. Travailler... puis sauvegarder votre travail
git add .
git commit -m "feat: description courte de ce que vous avez fait"

# 4. Envoyer votre branche sur GitHub
git push origin feature/nom-de-la-feature
```

### Fusionner une feature terminée dans `dev`

```bash
git checkout dev
git merge feature/nom-de-la-feature
git push origin dev
```

### Convention des messages de commit

| Préfixe | Usage |
|---|---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `chore:` | Mise à jour de dépendances |
| `style:` | Changement de style/UI |
| `docs:` | Modification de documentation |

**Exemples :**
```bash
git commit -m "feat: ajout écran de connexion Expo"
git commit -m "fix: correction erreur CORS FastAPI"
git commit -m "feat: création route POST /paiements"
```

### Branches du projet

| Branche | Rôle |
|---|---|
| `main` | Code stable et fonctionnel |
| `dev` | Branche de développement principale |
| `feature/xxx` | Fonctionnalité en cours |

> **Ne jamais pusher directement sur `main`**

---

## Structure du projet

```
Payflex/
├── backend/                  # API FastAPI
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
│
├── frontend-expo/            # Application mobile (Expo)
│
├── frontend-next/            # Application web (Next.js)
│   └── Dockerfile
│
├── docker-compose.yml        # Orchestration des services
├── .env                      # Variables d'environnement (non commité)
├── .env.example              # Modèle de variables d'environnement
└── README.md
```

---

## Problèmes fréquents

**Docker ne démarre pas**
> Vérifier que Docker Desktop est bien lancé avant d'exécuter `docker compose up`

**Port déjà utilisé**
> Stopper les services avec `docker compose down` puis relancer

**Expo ne voit pas le backend**
> Vérifier que vous utilisez l'IP locale de votre machine et non `localhost`

**Erreur de permissions sur Windows**
> Lancer le terminal en **Administrateur**

---

## Équipe

Projet réalisé dans le cadre d'un projet académique.
Dépôt : https://github.com/evegastephane/-Payflex-
