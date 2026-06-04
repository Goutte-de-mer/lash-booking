# Évaluation — Application vulnérable, sécurisation et pipeline DevSecOps

**Travail : Individuel**

---

## Objectif général

L'objectif du projet est de concevoir une application web volontairement vulnérable, puis de produire une version corrigée et sécurisée de cette même application.

Le projet doit montrer votre capacité à :

- comprendre les vulnérabilités web et API modernes ;
- les intégrer volontairement dans une version vulnérable ;
- les exploiter de manière contrôlée ;
- les documenter clairement ;
- corriger les causes profondes ;
- sécuriser l'application ;
- automatiser des contrôles de sécurité dans une pipeline CI/CD.

---

## Principe du projet

Vous devez développer une application web avec deux versions distinctes dans le même dépôt Git :

- `vulnerable`
- `secure`

### Branche `vulnerable`

Cette branche contient la version volontairement vulnérable de l'application.  
Elle doit contenir plusieurs failles web/API exploitables, documentées et démontrables.

### Branche `secure`

Cette branche contient la version corrigée et sécurisée.  
Elle doit montrer les corrections apportées aux failles de la branche `vulnerable`.  
Elle doit aussi intégrer une pipeline de sécurité automatisée.

---

## Contraintes techniques

### Application attendue

L'application doit être une application web simple mais complète.  
Elle doit contenir au minimum :

- une authentification ;
- des utilisateurs ;
- au moins deux rôles, par exemple `user` et `admin` ;
- une API REST ;
- une ou plusieurs ressources métier ;
- des actions CRUD ;
- une interface web ou un client minimal pour interagir avec l'API.

### Exemples de thèmes possibles

Vous pouvez choisir librement le thème de l'application. Exemples :

- gestion de commandes ;
- plateforme de réservation ;
- mini e-commerce ;
- gestion de tickets ;
- gestion de véhicules ;
- espace de documents ;
- application de tâches ;
- plateforme de commentaires ;
- espace étudiant / cours ;
- gestion d'événements.

> **L'important n'est pas la complexité fonctionnelle, mais la qualité de la logique de sécurité.**

---

## Vulnérabilités attendues dans la version `vulnerable`

La version vulnérable doit contenir **au minimum 6 vulnérabilités différentes**.

### Vulnérabilités obligatoires

| Type de vulnérabilité | Exemple attendu |
|---|---|
| Broken Access Control / IDOR / BOLA | un utilisateur accède à une ressource qui ne lui appartient pas |
| Injection | SQLi, NoSQLi ou Command Injection |
| XSS | Reflected, Stored ou DOM XSS |
| Authentification faible | erreur login, token faible, session mal gérée, brute force possible |
| Mass Assignment | modification d'un champ sensible comme `role`, `price`, `status` |
| Security Misconfiguration / Information Disclosure | debug, stack trace, headers absents, données trop exposées |

### Vulnérabilités optionnelles

Vous pouvez ajouter :

- SSRF ;
- mauvaise configuration CORS ;
- JWT mal sécurisé ;
- fichier `.env` exposé volontairement dans une version de démonstration locale ;
- absence de rate limiting ;
- stockage token dans `localStorage` ;
- endpoints admin accessibles ;
- logs contenant des données sensibles.

> **Important** — Les vulnérabilités doivent être : volontaires, exploitables localement, documentées, non destructives, compréhensibles dans le rapport.

---

## Version sécurisée attendue

La branche `secure` doit corriger toutes les vulnérabilités documentées dans la branche `vulnerable`.

### Corrections attendues

| Faille | Correction attendue |
|---|---|
| IDOR / BOLA | contrôle ownership côté backend |
| Broken Access Control | vérification du rôle sur les routes sensibles |
| Injection | requêtes paramétrées, ORM sécurisé, validation stricte |
| XSS | encodage, sanitization, suppression `innerHTML`, CSP |
| Auth faible | rate limiting, messages génériques, expiration token |
| Mass Assignment | whitelist des champs autorisés |
| Information Disclosure | erreurs génériques, pas de stack trace en production |
| Security Headers | Helmet, CSP, HSTS, X-Frame-Options, etc. |
| CORS faible | origine autorisée explicitement |
| Données sensibles exposées | limitation des champs retournés par l'API |

> **La version sécurisée ne doit pas simplement bloquer un payload précis. Elle doit corriger la cause profonde de la vulnérabilité.**

---

## Pipeline sécurité attendue

La branche `secure` doit contenir une pipeline CI/CD avec des contrôles sécurité automatisés.

La pipeline peut être réalisée avec **GitHub Actions** ou **GitLab CI**.

### Contrôles minimum attendus

| Contrôle | Outil possible | Objectif |
|---|---|---|
| SAST | Semgrep | analyser le code source |
| SCA | npm audit, Snyk ou équivalent | analyser les dépendances |
| Secret scanning | Gitleaks | détecter les secrets exposés |
| DAST | OWASP ZAP baseline | tester l'application en fonctionnement |
| Tests applicatifs | npm test ou équivalent | vérifier que l'application fonctionne |

### Exemple de structure GitHub Actions

```
.github/
  workflows/
    security.yml
```

### Règles attendues

La pipeline doit :

- s'exécuter automatiquement sur `push` ou `pull_request` ;
- installer les dépendances ;
- lancer les tests ;
- lancer au moins un scan SAST ;
- lancer un audit des dépendances ;
- lancer un secret scanning ;
- lancer un scan DAST si possible ;
- échouer en cas de faille critique ou secret détecté.

---

## Audit de votre propre application

Vous devez réaliser un audit de votre propre version vulnérable. L'objectif est de prouver que vous comprenez les failles que vous avez intégrées.

### Pour chaque vulnérabilité, vous devez documenter :

| Élément | Contenu attendu |
|---|---|
| Nom | nom clair de la vulnérabilité |
| Type | OWASP / API Top 10 |
| Endpoint ou zone concernée | route, page, composant ou API |
| Description | explication claire de la faille |
| Cause | pourquoi la faille existe dans le code |
| Exploitation | comment l'attaquant l'exploite |
| Preuve | capture, requête HTTP, payload, réponse |
| Impact | risque technique et métier |
| Criticité | faible, moyenne, élevée ou critique |
| Correction | correction appliquée dans la branche `secure` |
| Validation | preuve que la faille est corrigée |

---

## Captures obligatoires

Votre rapport doit contenir des captures ou preuves pour illustrer les vulnérabilités de la version `vulnerable`.

### Captures attendues

Pour chaque vulnérabilité importante :

- capture Burp Suite ou navigateur ;
- requête HTTP vulnérable ;
- payload utilisé ;
- réponse serveur ;
- résultat visible côté application ;
- extrait de code vulnérable si pertinent ;
- extrait de code corrigé si pertinent.

### Exemple — Pour une faille IDOR

**Requête vulnérable :**

```http
GET /api/orders/102 HTTP/1.1
Authorization: Bearer <token_user1>
```

**Explication attendue :**  
L'utilisateur `user1` accède à une commande appartenant à `user2`. Le backend récupère la commande uniquement par son ID sans vérifier le propriétaire.

**Réponse vulnérable :**

```json
{
  "id": 102,
  "userId": 2,
  "customerEmail": "user2@test.local",
  "total": 149.99
}
```

**Correction attendue :**

```javascript
Order.findOne({
  where: {
    id: req.params.id,
    userId: req.user.id
  }
})
```

---

## Rapport Markdown attendu

Le rapport doit être rédigé en Markdown.

**Nom conseillé :** `SECURITY_AUDIT.md` ou `README_SECURITY.md`

### Structure obligatoire du rapport

```
# Rapport d'audit sécurité

1. Présentation du projet
2. Architecture de l'application
3. Installation et lancement
4. Organisation Git
5. Liste des vulnérabilités intégrées
6. Audit détaillé des vulnérabilités
   VULN-01 — Nom de la faille
     Type, Endpoint / zone concernée, Description, Cause technique,
     Exploitation, Preuve, Impact, Criticité, Correction appliquée,
     Validation après correction
7. Pipeline sécurité
8. Résultats des scans
9. Limites du projet
10. Conclusion
```

---

## Exemple de fiche vulnérabilité attendue

### VULN-01 — IDOR sur consultation de commande

**Type**  
Broken Access Control / IDOR / BOLA

**Endpoint concerné**  
`GET /api/orders/:id`

**Description**  
L'endpoint permet à un utilisateur authentifié de consulter une commande à partir de son identifiant. Cependant, le backend ne vérifie pas que la commande appartient bien à l'utilisateur connecté.

**Cause technique**  
La version vulnérable récupère la commande uniquement avec son ID :

```javascript
Order.findByPk(req.params.id)
// Aucun contrôle ownership n'est effectué.
```

**Exploitation**  
Un utilisateur connecté avec le compte `user1` modifie l'identifiant dans l'URL :

```http
GET /api/orders/102
Authorization: Bearer <token_user1>
```

La commande 102 appartient à `user2`.

**Preuve**  
Insérer ici une capture Burp Suite ou navigateur montrant :
- la requête ;
- le token `user1` ;
- la réponse contenant les données de `user2`.

**Impact**  
Cette faille permet à un utilisateur d'accéder aux commandes d'autres utilisateurs.

Impact possible :
- fuite de données personnelles ;
- exposition d'historique d'achat ;
- risque RGPD ;
- perte de confiance utilisateur.

**Criticité :** Élevée

**Correction appliquée**  
La version sécurisée vérifie que la commande appartient à l'utilisateur connecté :

```javascript
Order.findOne({
  where: {
    id: req.params.id,
    userId: req.user.id
  }
})
```

**Validation après correction**  
Après correction, la même requête retourne :

```
HTTP/1.1 404 Not Found
```
ou
```
HTTP/1.1 403 Forbidden
```

L'utilisateur `user1` ne peut plus accéder à la commande de `user2`.

---

## Organisation du dépôt Git

### Structure attendue

```
project/
├── README.md
├── SECURITY_AUDIT.md
├── package.json
├── src/
├── screenshots/
│   ├── vuln-01-idor.png
│   ├── vuln-02-xss.png
│   ├── vuln-03-injection.png
│   └── ...
├── .github/
│   └── workflows/
│       └── security.yml
└── .gitignore
```

### Branches attendues

- `vulnerable`
- `secure`

### Conseils Git

Créer des commits explicites. Exemples :

```
feat(app): add vulnerable order API
feat(vuln): add intentional IDOR on order endpoint
fix(authz): enforce ownership on order endpoint
fix(xss): sanitize comments before rendering
fix(api): prevent mass assignment on user update
chore(ci): add security pipeline
```

---

## Livrables attendus

| Livrable | Attendu |
|---|---|
| Code branche `vulnerable` | application fonctionnelle avec vulnérabilités |
| Code branche `secure` | application corrigée et sécurisée |
| Rapport Markdown | audit complet des vulnérabilités |
| Captures | preuves des exploitations |
| Pipeline sécurité | workflow CI/CD fonctionnel |
| README | installation, lancement, comptes de test |
| Commits Git | historique clair des corrections |

L'évaluation se fera à partir :
- du dépôt Git ;
- du rapport Markdown ;
- des captures ;
- de la cohérence des corrections ;
- de la pipeline sécurité.

---

## Critères d'évaluation

| Critère | Points |
|---|---|
| Application fonctionnelle | 2 |
| Version vulnérable avec failles cohérentes | 4 |
| Audit personnel et explications des failles | 4 |
| Captures et preuves d'exploitation | 2 |
| Version sécurisée et corrections efficaces | 4 |
| Pipeline sécurité DevSecOps | 2 |
| Qualité du dépôt Git, README et organisation | 1 |
| Qualité globale du rapport Markdown | 1 |
| **Total** | **20** |

---

## Détail du barème

### Application fonctionnelle — 2 points

Attendus :
- application installable ;
- fonctionnalités de base opérationnelles ;
- comptes de test fournis ;
- API testable ;
- README clair.

### Version vulnérable — 4 points

Attendus :
- au moins 6 vulnérabilités différentes ;
- failles réellement exploitables ;
- failles cohérentes avec l'application ;
- vulnérabilités non destructives ;
- présence d'une logique métier suffisante.

### Audit personnel — 4 points

Attendus :
- explication claire de chaque faille ;
- cause technique identifiée ;
- exploitation expliquée ;
- impact métier et technique ;
- criticité justifiée ;
- correction proposée.

### Captures et preuves — 2 points

Attendus :
- captures lisibles ;
- payloads visibles ;
- requêtes/réponses documentées ;
- preuves associées à chaque faille importante.

### Version sécurisée — 4 points

Attendus :
- corrections effectives ;
- contrôles backend ;
- validation des entrées ;
- protection auth/session ;
- headers et configuration ;
- corrections testées et expliquées.

### Pipeline sécurité — 2 points

Attendus :
- workflow fonctionnel ;
- SAST ;
- SCA ;
- secret scanning ;
- DAST si possible ;
- règles bloquantes sur risques critiques.

### Organisation Git & rapport — 2 points

Attendus :
- branches claires ;
- commits explicites ;
- README utilisable ;
- rapport Markdown structuré ;
- captures rangées ;
- projet facile à tester.

---

## Recommandations importantes

**Ne cherchez pas une application trop complexe.**  
Une application simple mais bien pensée vaut mieux qu'une application ambitieuse mal terminée.

### Priorité

La priorité est de montrer :
- votre compréhension des vulnérabilités ;
- votre capacité à les exploiter ;
- votre capacité à les corriger ;
- votre capacité à automatiser des contrôles sécurité.

### Bon projet

Un bon projet montre clairement : **Faille → Exploitation → Impact → Correction → Validation → Pipeline**

### Mauvais projet

Un mauvais projet contient :
- des failles non exploitables ;
- des corrections superficielles ;
- aucun contrôle backend ;
- un rapport vague ;
- aucune capture ;
- une pipeline non fonctionnelle ;
- un README insuffisant.

---

## Conclusion

Ce projet vise à reproduire un cycle complet de sécurité applicative :

1. Développement vulnérable
2. Audit personnel
3. Exploitation contrôlée
4. Documentation
5. Correction
6. Sécurisation
7. Pipeline DevSecOps

L'objectif n'est pas de produire une application parfaite, mais de démontrer une vraie compréhension offensive et défensive de la sécurité web moderne.
