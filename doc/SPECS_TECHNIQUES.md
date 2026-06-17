# Spécifications techniques — Plateforme de réservation de prestations (extensions de cils)

---

## Table des matières

- [1. Présentation du projet](#1-présentation-du-projet)
- [2. Stack technique](#2-stack-technique)
  - [Frontend & Backend](#frontend--backend)
  - [Base de données](#base-de-données)
  - [Authentification](#authentification)
  - [Validation & sécurité applicative](#validation--sécurité-applicative)
  - [Pipeline DevSecOps](#pipeline-devsecops)
- [3. Architecture du projet](#3-architecture-du-projet)
- [4. Modèles de données](#4-modèles-de-données-mongoose)
  - [User](#user)
  - [Service](#service-prestation)
  - [WorkingHours](#workinghours-plages-horaires-de-travail)
  - [Booking](#booking-réservation)
- [5. Fonctionnalités détaillées](#5-fonctionnalités-détaillées)
  - [Espace cliente](#51-espace-cliente-role-user)
  - [Espace admin](#52-espace-admin-role-admin)
- [6. API REST — Endpoints](#6-api-rest--endpoints)
- [7. Gestion des créneaux et disponibilités](#7-gestion-des-créneaux-et-disponibilités)
  - [Principe général](#principe-général)
  - [Correspondance date ↔ WorkingHours](#correspondance-date--workinghours)
  - [Affichage du calendrier](#affichage-du-calendrier)
  - [Battement entre deux rendez-vous](#battement-entre-deux-rendez-vous)
  - [Algorithme de calcul des disponibilités](#algorithme-de-calcul-des-disponibilités)
  - [Exemple concret](#exemple-concret)
  - [Déplacement d'un créneau (admin)](#déplacement-dun-créneau-admin)
  - [Paramètres de l'endpoint `/api/availability`](#paramètres-de-lendpoint-apiavailability)
- [8. Authentification & autorisation](#8-authentification--autorisation)
- [9. Vulnérabilités intégrées](#9-vulnérabilités-intégrées-branche-vulnerable)
- [10. Corrections apportées](#10-corrections-apportées-branche-secure)
- [11. Pipeline CI/CD](#11-pipeline-cicd--github-actions)
- [12. Organisation Git](#12-organisation-git)
- [13. Données de test et seed](#13-données-de-test-et-seed)
- [14. Installation et lancement](#14-installation-et-lancement)
- [15. Variables d'environnement](#15-variables-denvironnement)

---

## 1. Présentation du projet

Application web de réservation de prestations pour un salon d'extensions de cils.  
Les clientes peuvent consulter les prestations disponibles, réserver un ou deux créneaux, et gérer leurs rendez-vous depuis leur espace personnel.  
L'administratrice (l'esthéticienne) dispose d'un tableau de bord pour gérer l'agenda, les clientes et les paiements.

---

## 2. Stack technique

### Frontend & Backend

| Technologie | Rôle |
|---|---|
| **Next.js 16** (App Router) | Framework fullstack — rendu React côté serveur + API Routes |
| **React 18** | Interface utilisateur |
| **Tailwind CSS** | Styles utilitaires |

### Base de données

| Technologie | Rôle |
|---|---|
| **MongoDB** | Base de données NoSQL orientée documents |
| **Mongoose** | ODM — modélisation des schémas et requêtes |

### Authentification

| Technologie | Rôle |
|---|---|
| **JWT (jsonwebtoken)** | Génération et vérification des tokens d'authentification |
| **bcrypt** | Hashage des mots de passe |

> Les tokens JWT sont stockés en cookie `httpOnly` dans la version sécurisée, et dans le `localStorage` dans la version vulnérable (faille intentionnelle).

### Validation & sécurité applicative

| Technologie | Rôle |
|---|---|
| **Zod** | Validation et typage strict des inputs à chaque API Route — protection NoSQL injection et mass assignment |
| **`next.config.js` headers()** | Security headers HTTP natifs Next.js (CSP, HSTS, X-Frame-Options…) — pas de Helmet, inutile sans Express |
| **Middleware Next.js** (`middleware.js`) | Rate limiting in-process sur les routes sensibles (login, register) via un compteur en mémoire par IP |

> **Pourquoi pas `express-rate-limit` ?** Cette lib est conçue pour Express. Next.js App Router n'expose pas de serveur Express natif. Le rate limiting se fait dans `middleware.js` (Edge Runtime) ou directement dans les API Routes avec un `Map` en mémoire. Pour un projet de démonstration local, l'approche in-process est suffisante et ne nécessite pas de dépendance externe.

> **Pourquoi pas `mongoose-sanitize` ?** Ce package (et son équivalent `express-mongo-sanitize`) était conçu pour Express et est aujourd'hui considéré comme une protection insuffisante. La recommandation actuelle est de valider les types en amont avec **Zod** : si le schéma attend un `string`, Zod rejette tout objet `{ "$ne": "" }` avant même que Mongoose ne soit appelé.

### Pipeline DevSecOps

| Technologie | Rôle |
|---|---|
| **Gitleaks** | Secret scanning (pipeline CI/CD) |
| **Semgrep** (`--config auto`) | Analyse statique SAST — détecte automatiquement le contexte JavaScript/Next.js |
| **OWASP ZAP** | Scan DAST en mode baseline |
| **GitHub Actions** | Pipeline CI/CD DevSecOps |

---

## 3. Architecture du projet

```
lash-booking/
├── app/
│   ├── api/                        # API Routes Next.js
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   └── register/route.js
│   │   ├── bookings/
│   │   │   ├── route.js            # GET (liste) / POST (création)
│   │   │   └── [id]/route.js       # GET / PATCH / DELETE
│   │   ├── services/
│   │   │   └── route.js            # GET liste des prestations
│   │   ├── availability/
│   │   │   └── route.js            # GET créneaux disponibles (calcul dynamique)
│   │   └── admin/
│   │       ├── working-hours/
│   │       │   └── route.js        # GET / PATCH plages horaires
│   │       ├── clients/
│   │       │   ├── route.js        # GET liste clients
│   │       │   └── [id]/route.js   # GET fiche client
│   │       └── bookings/
│   │           └── [id]/route.js   # PATCH déplacement / DELETE annulation
│   ├── (auth)/
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   ├── dashboard/
│   │   └── page.jsx                # Espace cliente — prochains RDV
│   ├── booking/
│   │   └── page.jsx                # Tunnel de réservation
│   └── admin/
│       ├── page.jsx                # Tableau de bord admin
│       └── clients/
│           └── [id]/page.jsx       # Fiche client admin
├── lib/
│   ├── mongodb.js                  # Connexion MongoDB
│   ├── jwt.js                      # Helpers JWT
│   └── middleware/
│       ├── auth.js                 # Vérification token
│       └── adminOnly.js            # Vérification rôle admin
├── models/
│   ├── User.js
│   ├── Booking.js
│   ├── Service.js
│   └── WorkingHours.js
├── lib/
│   └── availability.js             # Logique de calcul des disponibilités
├── screenshots/                    # Captures des vulnérabilités
├── .github/
│   └── workflows/
│       └── security.yml
├── .env.local
├── .gitignore
├── README.md
└── SECURITY_AUDIT.md
```

---

## 4. Modèles de données (Mongoose)

### User

```javascript
{
  _id: ObjectId,
  name: String,           // Prénom + Nom
  email: String,          // unique
  password: String,       // hashé avec bcrypt
  role: String,           // "user" | "admin"  ← champ sensible (Mass Assignment)
  createdAt: Date
}
```

### Service (prestation)

```javascript
{
  _id: ObjectId,
  name: String,           // ex. "Pose complète volume russe"
  description: String,
  duration: Number,       // en minutes : 45 | 60 | 75
  price: Number,          // prix total en euros
  depositAmount: Number   // montant de l'acompte
}
```

### WorkingHours (plages horaires de travail)

```javascript
{
  _id: ObjectId,
  dayOfWeek: Number,    // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  startTime: String,    // "09:00"
  endTime: String,      // "19:00"
  isActive: Boolean     // false = jour fermé
}
```

> C'est la seule configuration nécessaire. Pas de table de créneaux prédéfinis — les disponibilités sont calculées dynamiquement à partir de cette config et des réservations existantes.

### Booking (réservation)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // référence User
  serviceId: ObjectId,    // référence Service
  slotStart: Date,        // date + heure de début du RDV  ← source de vérité
  duration: Number,       // durée en minutes (45 | 60 | 75), copie depuis Service
  status: String,         // "pending" | "confirmed" | "cancelled"
  paymentType: String,    // "deposit" | "full"
  paymentStatus: String,  // "unpaid" | "partial" | "paid"
  amountPaid: Number,
  createdAt: Date
}
```

> `slotStart` + `duration` sont les deux seuls champs qui définissent un bloc occupé dans l'agenda. Pas de référence à une table `Slot`.

---

## 5. Fonctionnalités détaillées

### 5.1 Espace cliente (`role: user`)

#### Inscription / Connexion
- Formulaire d'inscription (nom, email, mot de passe)
- Connexion avec email + mot de passe
- Token JWT retourné et stocké côté client

#### Tunnel de réservation

Le tunnel se déroule en étapes séquentielles :

**Étape 1 — Sélection de la prestation**
- Affichage de toutes les prestations disponibles (nom, durée, prix, acompte)
- Sélection d'une seule prestation

**Étape 2 — Choix du créneau**
- Affichage d'un calendrier mensuel
- Les jours fermés (`isActive: false`) et les jours passés sont grisés et non cliquables
- Au chargement, un appel `GET /api/admin/working-hours` détermine quels `dayOfWeek` sont actifs pour griser les bons jours
- Au clic sur un jour ouvert → appel `GET /api/availability?date=YYYY-MM-DD&duration=X`
- Affichage des créneaux disponibles sous forme de pills cliquables (ex. `14:45 - 15:30`)
- Sélection d'un créneau

**Étape 3 — Paiement**
- Choix du type de paiement : acompte ou totalité

**Étape 4 — Confirmation**
- Récapitulatif (prestation, date, créneau, montant)
- Soumission → `POST /api/bookings` avec la réservation validée

#### Espace personnel (dashboard)
- Liste des prochains rendez-vous (date, prestation, statut)
- Statut du paiement (acompte versé / payé en totalité / en attente)
- Possibilité d'annuler un rendez-vous

### 5.2 Espace admin (`role: admin`)

#### Tableau de bord
- Vue du prochain rendez-vous (date, heure, prestation, nom de la cliente)
- Liste chronologique des réservations à venir
- Indicateur de statut de paiement par réservation

#### Gestion des clientes
- Liste de toutes les clientes
- Fiche client détaillée :
  - Informations personnelles (nom, email)
  - Historique des réservations
  - Statut de paiement par réservation
  - Prochain rendez-vous si existant

#### Gestion des réservations
- Déplacement d'un créneau : choix parmi les créneaux disponibles compatibles avec la durée de la prestation
- Annulation d'une réservation (libère le créneau)

---

## 6. API REST — Endpoints

### Authentification

| Méthode | Endpoint | Description | Auth requise |
|---|---|---|---|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |

### Prestations

| Méthode | Endpoint | Description | Auth requise |
|---|---|---|---|
| GET | `/api/services` | Liste des prestations | Non |

### Disponibilités

| Méthode | Endpoint | Description | Auth requise |
|---|---|---|---|
| GET | `/api/availability?date=YYYY-MM-DD&duration=60` | Créneaux disponibles pour une durée et une date | Oui |
| GET | `/api/availability?date=YYYY-MM-DD&duration=60&excludeBookingId=xxx` | Idem, en excluant une réservation (déplacement) | Oui (admin) |

### Réservations (cliente)

| Méthode | Endpoint | Description | Auth requise |
|---|---|---|---|
| GET | `/api/bookings` | Réservations de l'utilisateur connecté | Oui (user) |
| POST | `/api/bookings` | Créer une ou deux réservations | Oui (user) |
| GET | `/api/bookings/:id` | Détail d'une réservation | Oui (user) |
| PATCH | `/api/bookings/:id` | Modifier une réservation | Oui (user) |
| DELETE | `/api/bookings/:id` | Annuler une réservation | Oui (user) |

### Administration

| Méthode | Endpoint | Description | Auth requise |
|---|---|---|---|
| GET | `/api/admin/clients` | Liste de toutes les clientes | Oui (admin) |
| GET | `/api/admin/clients/:id` | Fiche client | Oui (admin) |
| PATCH | `/api/admin/bookings/:id` | Déplacer / modifier une réservation | Oui (admin) |
| DELETE | `/api/admin/bookings/:id` | Annuler une réservation | Oui (admin) |
| GET | `/api/admin/working-hours` | Consulter les plages horaires | Oui (admin) |
| PATCH | `/api/admin/working-hours` | Modifier les plages horaires | Oui (admin) |

---

## 7. Gestion des créneaux et disponibilités

### Principe général

Il n'existe pas de table de créneaux prédéfinis en base. Les disponibilités sont **calculées dynamiquement** à chaque appel de l'API, à partir de deux sources :

1. **`WorkingHours`** — les plages horaires configurées par l'admin (ex. vendredi 10h–13h30)
2. **`Booking`** — les réservations existantes, qui définissent les blocs déjà occupés

Cette approche gère naturellement des prestations de durées différentes sans jamais avoir à prégénérer ou maintenir une liste de créneaux.

### Correspondance date ↔ WorkingHours

Quand une date est sélectionnée dans le calendrier, le frontend ou le backend extrait le jour de la semaine :

```javascript
const dayOfWeek = new Date("2026-06-18").getDay() // → 4 (jeudi)
const wh = await WorkingHours.findOne({ dayOfWeek: 4, isActive: true })
// → { startTime: "10:00", endTime: "19:30" }

// On construit les bornes réelles pour ce jour précis
const start = new Date("2026-06-18T10:00:00")
const end   = new Date("2026-06-18T19:30:00")
```

L'algo de disponibilité tourne ensuite sur cet intervalle.

### Affichage du calendrier

- Au chargement du tunnel, un appel `GET /api/admin/working-hours` retourne les 7 jours avec leur statut `isActive`
- Le frontend grise et désactive les `dayOfWeek` dont `isActive: false` (samedi, dimanche) ainsi que les dates passées
- Aucun appel de disponibilité n'est fait pour ces jours — ils ne sont pas cliquables

### Battement entre deux rendez-vous

Un battement fixe de **5 minutes** est ajouté après chaque réservation. Constante définie dans `lib/availability.js`.

```
Bloc occupé réel = slotStart → slotStart + duration + 5 min
```

### Algorithme de calcul des disponibilités

Appelé par `GET /api/availability?date=YYYY-MM-DD&duration=60` :

```
1. Récupérer le WorkingHours du jour demandé via dayOfWeek
   → Si isActive: false → retourner [] immédiatement

2. Construire les bornes : date + startTime, date + endTime

3. Récupérer toutes les Booking actives du jour (status != "cancelled")
   → construire la liste des blocs occupés :
     blocs = bookings.map(b => ({
       start : b.slotStart,
       end   : b.slotStart + b.duration + 5min
     }))

4. Générer les candidats toutes les 15 minutes entre startTime et endTime

5. Pour chaque candidat T :
   - Fenêtre souhaitée : [T, T + duration + 5min]
   - Vérifier qu'elle ne chevauche aucun bloc occupé
   - Vérifier qu'elle se termine avant endTime
   → Si oui : T est disponible

6. Retourner la liste des T valides
   sous forme [{slotStart: "14:45", slotEnd: "15:30"}, ...]
```

### Exemple concret

Configuration : vendredi 10h00–13h30, pas de 15 min, battement 5 min.
Réservation existante : 11h00, durée 60 min → bloc occupé `[11h00 → 12h05]`.
Demande : créneaux disponibles pour une prestation de **45 min**.

```
Candidat  Fenêtre demandée         Chevauchement ?      Résultat
10h00     [10h00 → 10h50]          Non                  ✅ disponible
10h15     [10h15 → 11h05]          Oui (11h00)          ❌
10h30     [10h30 → 11h20]          Oui                  ❌
10h45     [10h45 → 11h35]          Oui                  ❌
11h00     [11h00 → 11h50]          Oui                  ❌
11h15     [11h15 → 12h05]          Oui                  ❌
11h30     [11h30 → 12h20]          Oui                  ❌
11h45     [11h45 → 12h35]          Oui                  ❌
12h05     [12h05 → 12h55]          Non                  ✅ disponible
12h20     [12h20 → 13h10]          Non                  ✅ disponible
12h35     [12h35 → 13h25]          Non                  ✅ disponible
12h50     [12h50 → 13h40]          Dépasse 13h30        ❌
```

### Déplacement d'un créneau (admin)

La réservation en cours de modification est exclue des blocs occupés pour ne pas entrer en conflit avec elle-même :

```javascript
const blocs = bookings
  .filter(b => b._id.toString() !== excludeBookingId)
  .map(b => ({ start: b.slotStart, end: b.slotStart + b.duration + BUFFER }))
```

### Paramètres de l'endpoint `/api/availability`

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `date` | `YYYY-MM-DD` | Oui | Date souhaitée |
| `duration` | `45\|60\|75` | Oui | Durée de la prestation en minutes |
| `excludeBookingId` | ObjectId | Non | Réservation à ignorer (déplacement admin) |

---

## 8. Authentification & autorisation

### Flux d'authentification

1. La cliente s'inscrit → mot de passe hashé avec `bcrypt` → enregistrement en base
2. Connexion → vérification du hash → génération d'un JWT signé (payload : `userId`, `role`, `exp`)
3. Le token est envoyé dans chaque requête (header `Authorization: Bearer <token>` ou cookie)
4. Un middleware vérifie le token et expose `req.user` dans les API Routes
5. Un second middleware vérifie `req.user.role === "admin"` pour les routes admin

### Rôles

| Rôle | Accès |
|---|---|
| `user` | Ses propres réservations uniquement |
| `admin` | Toutes les réservations, toutes les clientes, gestion complète |

---

## 9. Vulnérabilités intégrées (branche `vulnerable`)

> Chaque vulnérabilité est documentée en détail dans `SECURITY_AUDIT.md`.

| ID | Nom | Type | Zone concernée |
|---|---|---|---|
| VULN-01 | IDOR sur consultation de réservation | Broken Access Control / IDOR | `GET /api/bookings/:id` |
| VULN-02 | NoSQL Injection sur le login | Injection (NoSQLi) | `POST /api/auth/login` |
| VULN-03 | XSS stocké dans le nom de la cliente | Stored XSS | Tableau de bord admin |
| VULN-04 | Mass Assignment sur la création de réservation | Mass Assignment | `POST /api/bookings` |
| VULN-05 | Authentification faible — JWT sans expiration + brute force possible | Auth faible | `POST /api/auth/login` |
| VULN-06 | Information Disclosure — stack trace et données trop exposées | Security Misconfiguration | `GET /api/admin/clients/:id` |
| VULN-07 | CORS trop permissif | Security Misconfiguration | Configuration globale |
| VULN-08 | Token stocké dans `localStorage` | Auth faible / XSS amplification | Frontend |

---

## 10. Corrections apportées (branche `secure`)

| Vulnérabilité | Correction |
|---|---|
| IDOR | Vérification `userId === req.user.id` sur chaque accès à une réservation |
| NoSQL Injection | Validation Zod sur chaque API Route — typage strict qui rejette tout opérateur `$` avant la requête Mongoose |
| XSS stocké | Next.js échappe les variables JSX par défaut ; suppression de tout `dangerouslySetInnerHTML` ; ajout d'une CSP via `next.config.js` |
| Mass Assignment | Whitelist explicite via un schéma Zod par endpoint — seuls les champs déclarés dans le schéma sont extraits du body |
| Auth faible | Expiration JWT (`exp: 1h`) ; rate limiting sur `/api/auth/login` via `middleware.js` (5 tentatives / 15 min par IP) ; messages d'erreur génériques |
| Info Disclosure | Erreurs génériques en production (`NODE_ENV=production`) ; suppression des stack traces ; limitation des champs retournés (sélection explicite dans les requêtes Mongoose) |
| CORS | `next.config.js` — restriction explicite des origines autorisées |
| Token localStorage | Stockage en cookie `httpOnly; Secure; SameSite=Strict` via `Set-Cookie` dans la réponse API |
| Headers manquants | `next.config.js` → `headers()` : CSP, HSTS (`Strict-Transport-Security`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` |

---

## 11. Pipeline CI/CD — GitHub Actions

Fichier : `.github/workflows/security.yml`

### Étapes de la pipeline

```
push / pull_request
        │
        ▼
┌─────────────────────┐
│  Install & Build    │  npm ci + next build
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  Tests applicatifs  │  npm test
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│       SAST          │  semgrep --config auto
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│        SCA          │  npm audit --audit-level=high
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  Secret Scanning    │  Gitleaks
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│       DAST          │  OWASP ZAP baseline scan
└─────────────────────┘
        │
        ▼
   ✅ Pass / ❌ Fail
```

> **`semgrep --config auto`** détecte automatiquement les langages et frameworks présents dans le dépôt (JavaScript, TypeScript, React, Next.js) et sélectionne les règles adaptées depuis le registre Semgrep. Pas besoin de spécifier manuellement un ruleset.

### Règles bloquantes

- `npm audit` échoue si une vulnérabilité de niveau `high` ou `critical` est détectée
- Gitleaks échoue si un secret est détecté dans le code
- Semgrep échoue sur les règles de sévérité `ERROR`

### Faux positif connu — PostCSS (GHSA-qx2v-qp2m-jg93)

`npm audit` remonte systématiquement une vulnérabilité **moderate** liée à PostCSS `< 8.5.10`, embarqué dans les dépendances internes de Next.js 16.

```
postcss <8.5.10
Severity: moderate
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output
node_modules/next/node_modules/postcss
```

**Pourquoi ce n'est pas un vrai risque ici**

Cette vulnérabilité concerne la sortie CSS générée par PostCSS lors du build. Dans Next.js, le CSS est compilé statiquement au moment du build et servi sous forme de fichiers — PostCSS ne traite pas d'entrées utilisateur à l'exécution. Le vecteur d'attaque documenté n'est pas applicable dans ce contexte.

**Pourquoi ne pas faire `npm audit fix --force`**

La "correction" proposée par npm est de rétrograder Next.js à la version 9.3.3, ce qui constitue un downgrade de 7 versions majeures et casserait l'ensemble de l'application. C'est une fausse solution.

**Solution retenue**

La pipeline utilise `--audit-level=high` : seules les vulnérabilités `high` et `critical` font échouer le build. La vulnérabilité `moderate` de PostCSS est ainsi ignorée sans masquer de vraies menaces.

Cette dépendance transitive est sous la responsabilité de Vercel (mainteneur de Next.js) et sera corrigée lors d'une prochaine mise à jour du framework.

> Ce faux positif est documenté dans la section **"Limites du projet"** du rapport `SECURITY_AUDIT.md`.

---

## 12. Organisation Git

### Branches

| Branche | Contenu |
|---|---|
| `vulnerable` | Application fonctionnelle avec les 8 vulnérabilités intégrées |
| `secure` | Application corrigée + pipeline CI/CD |

### Conventions de commits

```
feat(app): initial project structure
feat(auth): add login and register endpoints
feat(booking): add booking creation and listing
feat(admin): add admin dashboard and client view
feat(vuln): add intentional IDOR on booking endpoint
feat(vuln): add NoSQL injection on login
feat(vuln): add stored XSS on client name field
feat(vuln): add mass assignment on booking creation
feat(vuln): add weak JWT (no expiration)
feat(vuln): add information disclosure on admin route
fix(authz): enforce ownership check on bookings
fix(injection): add Zod schema validation on login inputs
fix(xss): remove dangerouslySetInnerHTML and add CSP header
fix(api): add Zod whitelist schema on booking creation
fix(auth): add rate limiting in middleware and JWT expiration
fix(disclosure): remove stack traces, generic error messages
fix(cors): restrict allowed origins in next.config.js
fix(token): move JWT to httpOnly cookie
fix(headers): add security headers in next.config.js
chore(ci): add security pipeline
```

---

## 13. Données de test et seed

Toutes les données initiales sont créées via `scripts/seed.js`.

### Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Cliente | `user1@test.local` | `password123` |
| Cliente | `user2@test.local` | `password123` |
| Admin | `admin@test.local` | `admin123` |

### Plages horaires (`WorkingHours`)

Les 7 jours sont systématiquement seedés — les jours fermés avec `isActive: false` — pour éviter les erreurs `null` côté API quand une date tombe un week-end.

```javascript
await WorkingHours.insertMany([
  { dayOfWeek: 1, startTime: "10:00", endTime: "19:30", isActive: true  }, // lundi
  { dayOfWeek: 2, startTime: "10:00", endTime: "19:30", isActive: true  }, // mardi
  { dayOfWeek: 3, startTime: "10:00", endTime: "19:30", isActive: true  }, // mercredi
  { dayOfWeek: 4, startTime: "10:00", endTime: "19:30", isActive: true  }, // jeudi
  { dayOfWeek: 5, startTime: "10:00", endTime: "13:30", isActive: true  }, // vendredi (demi-journée)
  { dayOfWeek: 6, isActive: false },                                        // samedi — fermé
  { dayOfWeek: 0, isActive: false },                                        // dimanche — fermé
])
```

> `dayOfWeek` suit la convention JavaScript : `0` = dimanche, `1` = lundi, …, `6` = samedi.

### Prestations (`Service`)

```javascript
await Service.insertMany([
  {
    name: "Retouche",
    description: "Retouche sur pose existante",
    duration: 45,
    price: 45,
    depositAmount: 20,
  },
  {
    name: "Pose complète naturelle",
    description: "Pose complète cils naturels un à un",
    duration: 60,
    price: 65,
    depositAmount: 30,
  },
  {
    name: "Pose complète volume russe",
    description: "Pose complète effet volume russe",
    duration: 75,
    price: 85,
    depositAmount: 40,
  },
])
```

---

## 14. Installation et lancement

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd lash-booking

# Installer les dépendances
# Inclut : next, mongoose, jsonwebtoken, bcrypt, zod
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Renseigner : MONGODB_URI, JWT_SECRET, ALLOWED_ORIGIN

# Lancer le seed (comptes de test + prestations + plages horaires)
node scripts/seed.js

# Lancer en développement
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## 15. Variables d'environnement

```env
# .env.example

MONGODB_URI=mongodb://localhost:27017/lash-booking
JWT_SECRET=changeme
ALLOWED_ORIGIN=http://localhost:3000
NODE_ENV=development
```

> **Note :** Dans la branche `vulnerable`, un fichier `.env.local` avec des valeurs de démonstration est volontairement commité pour illustrer la faille d'exposition de secrets (VULN optionnelle). Il sera supprimé et ajouté au `.gitignore` dans la branche `secure`.
