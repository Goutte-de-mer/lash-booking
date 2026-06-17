# Notes vulnérabilités — brouillon (pas le rapport final)

Sert juste à se souvenir de ce qui est en place avant de rédiger `SECURITY_AUDIT.md`.
Champs repris du barème : Type, Endpoint, Description, Cause, Exploitation, Preuve, Impact, Criticité, Correction, Validation.

## Couverture des 6 catégories obligatoires

- [x] Broken Access Control / IDOR → VULN-01
- [x] Injection → VULN-02 (faible, à muscler ou documenter telle quelle)
- [ ] XSS → **pas encore fait**
- [x] Auth faible → VULN-05
- [x] Mass Assignment → VULN-04 (booking + register/role)
- [ ] Security Misconfig / Info Disclosure → **pas encore fait**

→ 4/6 catégories obligatoires couvertes. Il manque XSS et Info Disclosure pour valider le minimum.

---

## VULN-01 — IDOR sur les réservations
- **Statut** : ✅ en place
- **Type** : Broken Access Control / IDOR / BOLA (API1:2023)
- **Endpoint** : `GET/DELETE/PATCH /api/bookings/[id]`
- **Fichier** : `src/app/api/bookings/[id]/route.js`
- **Cause** : `Booking.findById(id)` / `findByIdAndDelete(id)` / `findByIdAndUpdate(id)` → aucun filtre sur `userId`
- **Exploitation** : se connecter en user1, récupérer un id de résa appartenant à user2 (ou deviner via `GET /api/bookings` d'un autre compte), puis `GET /api/bookings/<id>` avec le token user1 → ça renvoie quand même les données
- **Preuve à faire** : requête + token user1 + réponse contenant les infos de user2
- **Impact** : lecture/modif/suppression de résa d'autrui → fuite données perso, sabotage planning
- **Criticité** : Élevée
- **Correction prévue (secure)** : `Booking.findOne({ _id: id, userId: user.id })`
- **Validation prévue** : 404 si pas owner

---

## VULN-02 — NoSQL Injection sur le login
- **Statut** : ⚠️ en place mais limitée — à vérifier si vraiment exploitable pour bypass
- **Type** : Injection (NoSQLi) — A03:2021
- **Endpoint** : `POST /api/auth/login`
- **Fichier** : `src/app/api/auth/login/route.js`
- **Cause** : `const { email, password } = await req.json()` puis `User.findOne({ email })` direct, pas de validation de type → un objet avec opérateur Mongo (`$ne`, `$gt`, `$regex`...) passe tel quel
- **Exploitation** : `POST { "email": { "$gt": "" }, "password": "x" }` → `findOne` renvoie le 1er user de la collection, mais `bcrypt.compare` échoue ensuite si le password ne correspond pas → ne casse pas l'auth direct (password pas dans la requête Mongo). Utile surtout pour **énumération**.
- ⚠️ **À décider** : documenter tel quel (énumération) OU rendre le bypass total possible (ex. comparer aussi le password via Mongo plutôt que bcrypt sur un champ annexe) pour un POC plus impressionnant. À trancher avant de rédiger l'audit.
- **Preuve à faire** : requête Burp/Postman avec le payload objet + réponse
- **Impact** : énumération de comptes existants, requêtes Mongo manipulées
- **Criticité** : Moyenne (en l'état)
- **Correction prévue** : Zod `z.string().email()` → rejette tout objet avant Mongoose
- **Validation prévue** : payload objet → 400 Bad Request

---

## VULN-03 — XSS stocké sur le nom de la cliente
- **Statut** : ❌ PAS ENCORE FAIT
- **Type** : Stored XSS
- **Zone prévue** : dashboard admin / liste des clientes (page admin pas encore créée)
- **À faire** :
  1. créer la page admin qui liste les clientes (affiche `user.name`)
  2. rendre ce `name` avec `dangerouslySetInnerHTML` (pour casser l'échappement JSX auto de React)
  3. payload injecté via `POST /api/auth/register` champ `name` = `<img src=x onerror="...">` ou `<script>...</script>`
- **Preuve prévue** : capture de l'exécution JS dans le dashboard admin après login admin
- **Impact prévu** : vol token (combo VULN-08), defacement, actions au nom de l'admin
- **Criticité prévue** : Élevée
- **Correction prévue** : suppression `dangerouslySetInnerHTML`, laisser React échapper, + CSP via `next.config.js` headers()

---

## VULN-04 — Mass Assignment (2 endroits)

### 4a) Réservations
- **Statut** : ✅ en place
- **Endpoint** : `POST /api/bookings` + `PATCH /api/bookings/[id]`
- **Fichier** : `src/app/api/bookings/route.js` (L33) / `[id]/route.js` (L59-63)
- **Cause** : `Booking.create({ ...body, userId: user.id })` / `findByIdAndUpdate(id, { ...body })` → body entier spread, pas de whitelist
- **Exploitation** : `POST /api/bookings` avec `{ serviceId, slotStart, duration, paymentType, status: "confirmed", paymentStatus: "paid", amountPaid: 999 }`
- **Preuve à faire** : réponse 201 → `status: "confirmed", paymentStatus: "paid"` alors que rien n'a été payé
- **Impact** : résa auto-validée/payée sans paiement réel → perte financière
- **Criticité** : Élevée

### 4b) Register — élévation de privilège via `role`
- **Statut** : ✅ en place (c'est la pire faille actuelle)
- **Endpoint** : `POST /api/auth/register`
- **Fichier** : `src/app/api/auth/register/route.js` (L6 + L21-26)
- **Cause** : `const { name, email, password, role } = await req.json()` → `role` repris direct du body et passé à `User.create`
- **Exploitation** : `POST /api/auth/register` avec `{ name, email, password, role: "admin" }` → compte admin créé direct, aucune vérif
- **Preuve à faire** : 201 puis login avec ce compte → JWT contient `role: "admin"`
- **Impact** : élévation de privilège totale / prise de contrôle admin sans aucune barrière
- **Criticité** : **Critique** — à mettre en avant dans le rapport, c'est la démo la plus parlante
- **Correction prévue** : whitelist Zod stricte sur register → `role` jamais lu depuis le body, toujours `"user"` par défaut

---

## VULN-05 — Authentification faible
- **Statut** : ✅ en place
- **Type** : Broken Authentication
- **Zone** : `src/lib/jwt.js` (`signToken`), `POST /api/auth/login`
- **Cause** : `jwt.sign(payload, secret)` sans `expiresIn` → token valide indéfiniment ; pas de `middleware.js` ni compteur de tentatives → brute force possible sans blocage
- **Exploitation** : token volé = utilisable pour toujours ; script de brute force sans rate limit ni 429
- **Preuve à faire** : décoder le JWT (jwt.io) → pas de claim `exp` ; script qui boucle le login sans être bloqué
- **Impact** : session compromise permanente si token volé, brute force mots de passe faisable
- **Criticité** : Élevée
- **Correction prévue** : `jwt.sign(payload, secret, { expiresIn: "1h" })` + rate limiting dans `middleware.js` (5 tentatives/15min/IP)

---

## VULN-06 — Information Disclosure sur route admin
- **Statut** : ❌ PAS ENCORE FAIT
- **Type** : Security Misconfiguration / Information Disclosure
- **Zone prévue** : `GET /api/admin/clients/:id` (endpoint pas encore créé)
- **À faire** :
  - créer l'endpoint admin clients/[id]
  - renvoyer l'objet `User` complet (avec `password` hashé) et/ou laisser fuiter une stack trace (pas de try/catch + `NODE_ENV=development`)
- **Preuve prévue** : réponse JSON contenant le hash bcrypt du password, ou stack trace complète
- **Impact prévu** : fuite de hash (crackable offline), fuite de structure interne de l'app
- **Criticité prévue** : Élevée
- **Correction prévue** : `.select("-password")` sur la query Mongoose, erreurs génériques en prod

---

## (Optionnelles)

## VULN-07 — CORS permissif
- **Statut** : ❌ pas implémenté — `next.config.mjs` n'a aucun `headers()` actuellement, donc comportement par défaut (pas permissif, juste absent)
- **Décision à prendre** : soit ajouter explicitement `Access-Control-Allow-Origin: *` (ou origin reflété) pour la rendre réelle, soit la retirer de la liste finale des vulns

## VULN-08 — Token JWT dans localStorage
- **Statut** : ✅ en place
- **Type** : Auth faible / amplificateur de XSS (A07:2021)
- **Zone** : `LoginForm.jsx` (L38-42), `StepSlot.jsx`, `BookingTunnel.jsx` — partout où `localStorage.getItem/setItem("token")`
- **Cause** : choix volontaire de stocker le JWT en localStorage au lieu d'un cookie httpOnly
- **Exploitation** : combiné à VULN-03 (XSS) → `fetch(...).then(r => localStorage.getItem('token'))` exfiltre le token
- **Preuve à faire** : payload XSS qui lit le localStorage et l'envoie vers un endpoint externe
- **Impact** : vol de session complet si combiné à un XSS
- **Criticité** : Moyenne seule / Élevée combinée à VULN-03
- **Correction prévue** : cookie `httpOnly; Secure; SameSite=Strict` via `Set-Cookie`, suppression de tout `localStorage` côté front

---

## Reste à faire avant de pouvoir rédiger l'audit final

1. **XSS stocké** — créer la liste clientes admin + `dangerouslySetInnerHTML` sur `name`
2. **Info Disclosure** — créer `GET /api/admin/clients/:id` qui expose trop de données (password hash / stack trace)
3. **Trancher VULN-02** — documenter tel quel (énumération) ou renforcer pour un vrai bypass d'auth
4. **Trancher VULN-07 (CORS)** — l'implémenter pour de vrai ou la sortir de la liste
5. **Créer `scripts/seed.js`** — pas encore présent ; nécessaire pour avoir des comptes de test stables (user1, user2, admin) pour les captures
6. Faire les **captures** (Burp/navigateur) une fois chaque faille confirmée exploitable, ranger dans `screenshots/`

## Comptes de test prévus (à seed, pas encore créés)
- `user1@test.local` / `password123`
- `user2@test.local` / `password123`
- `admin@test.local` / `admin123`
