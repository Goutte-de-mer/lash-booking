# Lash Booking

Application web de réservation pour un salon de pose d'extensions de cils.  
Développée dans le cadre d'un projet de sécurité web — deux branches : `vulnerable` et `secure`.

---

## Prérequis

- Node.js ≥ 18
- MongoDB en local (port 27017 par défaut)

## Installation

```bash
git clone <repo>
cd lash-booking
npm install
```

Créer un fichier `.env.local` à la racine :

```
MONGODB_URI=mongodb://localhost:27017/lash-booking
JWT_SECRET=unsecret
```

## Données de test

```bash
node scripts/seed.mjs
```

## Lancement

```bash
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

---

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Cliente | `user1@test.local` | `password123` |
| Cliente | `user2@test.local` | `password123` |
| Cliente (payload XSS) | `xss@test.local` | `password123` |
| Admin | `admin@test.local` | `admin123` |

---

## Organisation du dépôt

| Branche | Description |
|---|---|
| `vulnerable` | Version intentionnellement vulnérable |
| `secure` | Version corrigée avec pipeline DevSecOps |

Le rapport d'audit complet est dans [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md).
