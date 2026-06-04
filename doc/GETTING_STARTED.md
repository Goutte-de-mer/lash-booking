# Guide de démarrage — lash-booking

Étapes complètes pour initialiser le projet, le connecter à GitHub et travailler sur les deux branches.

---

## Table des matières

- [Prérequis](#prérequis)
- [1. Créer le dépôt GitHub](#1-créer-le-dépôt-github)
- [2. Initialiser le projet Next.js](#2-initialiser-le-projet-nextjs)
- [3. Relier le projet local à GitHub](#3-relier-le-projet-local-à-github)
- [4. Installer les dépendances du projet](#4-installer-les-dépendances-du-projet)
- [5. Configurer les variables d'environnement](#5-configurer-les-variables-denvironnement)
- [6. Pousser la branche `vulnerable`](#6-pousser-la-branche-vulnerable)
- [7. Développer sur `vulnerable`](#7-développer-sur-vulnerable)
- [8. Créer la branche `secure`](#8-créer-la-branche-secure)
- [9. Corriger et sécuriser sur `secure`](#9-corriger-et-sécuriser-sur-secure)
- [10. Ajouter la pipeline CI/CD sur `secure`](#10-ajouter-la-pipeline-cicd-sur-secure)
- [Rappels importants](#rappels-importants)
- [Commandes Git utiles](#commandes-git-utiles)

---

## Prérequis

Avant de commencer, s'assurer d'avoir installé :

- **Node.js** >= 18
- **npm** >= 9
- **Git**
- Un compte **GitHub**
- Une instance **MongoDB** locale (ou un cluster MongoDB Atlas)

---

## 1. Créer le dépôt GitHub

1. Se connecter sur [github.com](https://github.com)
2. Cliquer sur **New repository**
3. Nom : `lash-booking`
4. Visibilité : Public ou Private selon ta préférence
5. **Ne pas cocher** "Add a README file", "Add .gitignore" ni "Choose a license" — on pousse tout depuis le local
6. Cliquer sur **Create repository**
7. Copier l'URL du dépôt : `https://github.com/<ton-username>/lash-booking.git`

---

## 2. Initialiser le projet Next.js

```bash
npx create-next-app@latest lash-booking
```

Répondre aux questions :

```
✔ Would you like to use TypeScript? → No
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like your code inside a `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to use Turbopack for next dev? → No
✔ Would you like to customize the import alias? → No
```

```bash
cd lash-booking
```

---

## 3. Relier le projet local à GitHub

```bash
git remote add origin https://github.com/<ton-username>/lash-booking.git
```

Vérifier que la connexion est établie :

```bash
git remote -v
# origin  https://github.com/<ton-username>/lash-booking.git (fetch)
# origin  https://github.com/<ton-username>/lash-booking.git (push)
```

---

## 4. Installer les dépendances du projet

```bash
npm install mongoose jsonwebtoken bcrypt zod
npm install -D @types/jsonwebtoken @types/bcrypt
```

Résumé des dépendances installées :

| Package | Rôle |
|---|---|
| `mongoose` | ODM MongoDB |
| `jsonwebtoken` | Génération et vérification JWT |
| `bcrypt` | Hashage des mots de passe |
| `zod` | Validation et typage des inputs (branche `secure`) |

---

## 5. Configurer les variables d'environnement

Créer le fichier `.env.local` à la racine :

```bash
cp .env.example .env.local
```

Si `.env.example` n'existe pas encore, le créer manuellement :

```env
MONGODB_URI=mongodb://localhost:27017/lash-booking
JWT_SECRET=changeme
ALLOWED_ORIGIN=http://localhost:3000
NODE_ENV=development
```

> **Note branche `vulnerable`** : le fichier `.env.local` sera volontairement commité avec de vraies valeurs pour illustrer la faille d'exposition de secrets. Sur la branche `secure`, il sera retiré du suivi Git.

---

## 6. Pousser la branche `vulnerable`

`create-next-app` crée automatiquement un commit initial sur `main`. On renomme cette branche en `vulnerable` :

```bash
git branch -m main vulnerable
```

Premier push :

```bash
git push -u origin vulnerable
```

Définir `vulnerable` comme branche par défaut sur GitHub :

1. Aller sur le dépôt GitHub → **Settings** → **Branches**
2. Sous "Default branch", cliquer sur l'icône ✏️
3. Choisir `vulnerable` → **Update** → confirmer

> Ainsi, quand le correcteur clone le repo, il tombe directement sur la version vulnérable.

---

## 7. Développer sur `vulnerable`

Toute l'application se développe ici : modèles, API routes, frontend, seed, et les failles intentionnelles.

S'assurer d'être sur la bonne branche :

```bash
git branch
# * vulnerable
```

Workflow de développement :

```bash
# Après chaque feature ou faille ajoutée
git add .
git commit -m "feat(auth): add login and register endpoints"
git push origin vulnerable

git add .
git commit -m "feat(vuln): add intentional IDOR on booking endpoint"
git push origin vulnerable
```

Ordre de développement recommandé :

```
1.  feat(app): initial project structure
2.  feat(auth): add login and register endpoints
3.  feat(booking): add booking creation and listing
4.  feat(admin): add admin dashboard and client view
5.  feat(seed): add seed script with test accounts and working hours
6.  feat(vuln): add intentional IDOR on booking endpoint
7.  feat(vuln): add NoSQL injection on login
8.  feat(vuln): add stored XSS on client name field
9.  feat(vuln): add mass assignment on booking creation
10. feat(vuln): add weak JWT (no expiration)
11. feat(vuln): add information disclosure on admin route
12. feat(vuln): add permissive CORS configuration
13. feat(vuln): store JWT in localStorage
```

---

## 8. Créer la branche `secure`

Une fois `vulnerable` terminée et stable, créer `secure` depuis cet état — elle repart avec tout le code existant.

```bash
# S'assurer d'être sur vulnerable et à jour
git checkout vulnerable
git pull origin vulnerable

# Créer secure depuis vulnerable
git checkout -b secure
git push -u origin secure
```

> `secure` et `vulnerable` ont maintenant le même historique de base. Les corrections vont diverger à partir d'ici.

---

## 9. Corriger et sécuriser sur `secure`

S'assurer d'être sur la bonne branche :

```bash
git branch
# * secure
```

Appliquer les corrections une par une, avec un commit explicite pour chacune :

```bash
git add .
git commit -m "fix(authz): enforce ownership check on bookings"
git push origin secure

git add .
git commit -m "fix(injection): add Zod schema validation on login inputs"
git push origin secure

git add .
git commit -m "fix(xss): remove dangerouslySetInnerHTML and add CSP header"
git push origin secure

git add .
git commit -m "fix(api): add Zod whitelist schema on booking creation"
git push origin secure

git add .
git commit -m "fix(auth): add rate limiting in middleware and JWT expiration"
git push origin secure

git add .
git commit -m "fix(disclosure): remove stack traces, generic error messages"
git push origin secure

git add .
git commit -m "fix(cors): restrict allowed origins in next.config.js"
git push origin secure

git add .
git commit -m "fix(token): move JWT to httpOnly cookie"
git push origin secure

git add .
git commit -m "fix(headers): add security headers in next.config.js"
git push origin secure
```

Retirer `.env.local` du suivi Git sur `secure` :

```bash
# Ajouter au .gitignore
echo ".env.local" >> .gitignore

# Retirer du suivi sans supprimer le fichier local
git rm --cached .env.local

git add .gitignore
git commit -m "fix(secrets): remove .env.local from git tracking"
git push origin secure
```

---

## 10. Ajouter la pipeline CI/CD sur `secure`

```bash
# S'assurer d'être sur secure
git checkout secure

mkdir -p .github/workflows
touch .github/workflows/security.yml
```

Remplir `.github/workflows/security.yml` avec le workflow (voir `SPECS_TECHNIQUES.md`, section 11).

```bash
git add .github/workflows/security.yml
git commit -m "chore(ci): add security pipeline"
git push origin secure
```

Vérifier que la pipeline se déclenche sur GitHub :

1. Aller sur le dépôt GitHub → onglet **Actions**
2. Le workflow `security.yml` doit apparaître et tourner automatiquement

---

## Rappels importants

**Ne jamais merger `secure` dans `vulnerable`** (ni l'inverse). Les deux branches doivent rester indépendantes — c'est ce que le correcteur va comparer.

**Ne jamais commiter `.env.local` sur `secure`**. Sur `vulnerable` uniquement, pour la faille d'exposition de secrets.

**Toujours vérifier sur quelle branche on est** avant de commiter :

```bash
git branch
# ou
git status
```

---

## Commandes Git utiles

### Naviguer entre les branches

```bash
git checkout vulnerable   # passer sur vulnerable
git checkout secure       # passer sur secure
```

### Voir l'historique des commits

```bash
git log --oneline
```

### Corriger un oubli sur `vulnerable` après avoir créé `secure`

```bash
# Retourner sur vulnerable
git checkout vulnerable

# Faire la correction
git add .
git commit -m "feat(vuln): add missing rate limit absence"
git push origin vulnerable

# Récupérer ce commit sur secure si nécessaire
git checkout secure
git cherry-pick <hash-du-commit>
git push origin secure
```

### Voir les différences entre les deux branches

```bash
git diff vulnerable..secure
```

### Vérifier l'état final du dépôt

```bash
git branch -a
# * secure
#   vulnerable
#   remotes/origin/secure
#   remotes/origin/vulnerable
```
