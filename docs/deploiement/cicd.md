# Pipeline CI/CD

> Cette procédure constitue une base proposée à des fins pédagogiques. Elle peut être librement adaptée en fonction des contraintes et des spécificités du contexte réel de mise en production.

## Déclenchement

Le workflow s'exécute sur :

- un `push` sur la branche `main` ;
- une `pull_request` ciblant `main`.

Seuls les jobs `build-backend` et `build-front-office` tournent sur les pull requests. Le job `docker` (build & push des images) est réservé aux `push` directs sur `main` - voir condition `if` du job.

## Étapes du workflow

### 1. `build-backend` - Build & test backend

Exécuté dans le dossier `backend/`.

1. `actions/checkout@v4` : récupération du code.
2. `actions/setup-node@v4` : installation de Node 20, avec cache npm basé sur `backend/package-lock.json`.
3. `npm ci` : installation des dépendances à partir du lockfile.
4. `npm test` : exécution des tests unitaires (Jest).
5. `npm run build` : compilation TypeScript.

### 2. `build-front-office` - Build front-office

Exécuté dans le dossier `front-office/`.

1. `actions/checkout@v4` : récupération du code.
2. `actions/setup-node@v4` : installation de Node 20, avec cache npm basé sur
   `front-office/package-lock.json`.
3. `npm ci` : installation des dépendances.
4. `npm run build` : build de production (le front-office n'a plus de
   variable d'environnement, il appelle l'API via le chemin relatif `/api`).

### 3. `docker` - Build & push des images (matrix)

Dépend de `build-backend` et `build-front-office` (`needs`). Ne s'exécute que
si l'évènement est un `push` sur `main`.

Job matriciel, une exécution par application :

| `matrix.app`   | `context`        | `matrix.image`             |
| -------------- | ---------------- | --------------------------- |
| backend        | `./backend`      | `go-easy-backend`         |
| front-office   | `./front-office` | `go-easy-front-office`    |

Étapes pour chaque application de la matrice :

1. `actions/checkout@v4` : récupération du code.
2. `docker/setup-buildx-action@v3` : mise en place de Buildx (build multi-plateforme, cache).
3. `docker/login-action@v3` : authentification à `ghcr.io` avec le
   `GITHUB_TOKEN` fourni automatiquement par GitHub Actions (aucun secret
   supplémentaire à gérer).
4. `docker/metadata-action@v5` : calcul des tags de l'image
   (`latest` + tag basé sur le SHA court du commit) et des labels OCI.
5. `docker/build-push-action@v6` : build de l'image Docker (stage `runtime`
   du Dockerfile multi-stage) puis push vers
   `ghcr.io/<compte-github>/<image>` avec les tags calculés à l'étape précédente.
   Le cache de build est stocké via GitHub Actions cache (`type=gha`), scopé
   par application pour ne pas mélanger les caches backend/front-office.

## Permissions et sécurité

- Le workflow déclare `permissions: contents: read` au niveau global, et
  `contents: read` + `packages: write` sur le job `docker` uniquement (le
  strict nécessaire pour pousser vers GHCR).
- Aucun accès à la VM de production n'est donné à GitHub Actions : la CI ne
  fait que construire et publier les images. Le déploiement se fait en mode
  **pull**, via `watchtower` côté serveur (voir
  [procédure de déploiement](procedure-de-deploiement.md)).
- Le seul secret utilisé est `GITHUB_TOKEN`, généré automatiquement par
  GitHub Actions pour la durée du run.

## Schéma récapitulatif

```txt
push / pull_request sur main
        │
        ▼
 ┌────────────────────┐   ┌───────────────────────┐
 │ build-backend       │   │ build-front-office     │
 │ npm ci / test /build│   │ npm ci / build          │
 └─────────┬───────────┘   └───────────┬───────────┘
           └───────────┬───────────────┘
                        ▼
              (uniquement si push sur main)
                        │
                        ▼
              ┌───────────────────┐
              │ docker (matrix)    │
              │ build image        │
              │ push → ghcr.io     │
              └───────────────────┘
```

La suite du processus (récupération des images par la VM via `watchtower`)
est décrite dans la [procédure de déploiement](procedure-de-deploiement.md).
