# Procédure de déploiement

> Cette procédure constitue une base proposée à des fins pédagogiques. Elle peut être librement adaptée en fonction des contraintes et des spécificités du contexte réel de mise en production.

## Accès au serveur fourni par l'organisme de formation

- VM : chaque étudiant dispose d'une VM personnelle
- Identifiant : chaque étudiant dispose d'un identifiant personnel
- Domaine : à renseigner selon l'environnement attribué
- Portail Web pour accès à la VM **hors réseau de l'organisme de formation** : <https://guacamole.stagiairesmns.fr/guacamole/>
- SSH pour accès à la VM **depuis le réseau de l'organisme de formation**

## Architecture du déploiement

Le déploiement repose sur un modèle **pull** : GitHub Actions ne se connecte
jamais à la VM. La CI se contente de construire les images Docker et de les
publier sur un registre (GitHub Container Registry). C'est la VM qui va
chercher (`pull`) les nouvelles images, via un conteneur `watchtower` qui
surveille le registre en continu.

```txt
GitHub (push sur main)
   │
   ▼
GitHub Actions (.github/workflows/ci-cd.yml)
   1. build-backend / build-front-office → compilation TypeScript (CI)
   2. docker (matrix backend / front-office) → build image (stage "runtime")
                                               → push vers ghcr.io
   │
   ▼
ghcr.io/<compte-github>/go-easy-backend:latest
ghcr.io/<compte-github>/go-easy-front-office:latest
   │
   ▼  (pull, jamais de push depuis GitHub)
VM (<ip> / <nom-de-domaine>)
   - watchtower : poll ghcr.io toutes les 60s
   - dès qu'une image labellisée change → recrée le conteneur concerné
```

Aucune donnée de connexion à la VM (SSH, clé, mot de passe) n'est stockée côté
GitHub : le seul secret utilisé par le pipeline est `GITHUB_TOKEN`
(automatique, fourni par GitHub Actions), uniquement pour pousser les images
vers `ghcr.io`.

## 1 - Installation initiale (une seule fois)

La préparation du serveur et l'installation initiale de l'application sont
décrites dans `docs/environnement-de-production/` :

- [1-configuration.md](../environnement-de-production/1-configuration.md) : préparation du serveur (SSH, utilisateur, pare-feu, Docker, Git)
- [2-installation.md](../environnement-de-production/2-installation.md) : installation initiale de l'application (clonage, variables d'environnement, NGINX, authentification GHCR, premier démarrage, seed)

## 2 - Mises à jour suivantes (automatiques)

Une fois le premier déploiement effectué, plus aucune action manuelle n'est
nécessaire sur la VM :

1. Un développeur pousse (`git push`) sur `main`.
2. GitHub Actions compile, build les images et les publie sur `ghcr.io`.
3. `watchtower`, qui tourne en continu sur la VM, détecte les nouvelles images
   des services labellisés (`backend`, `front-office`) et recrée
   automatiquement les conteneurs concernés (`WATCHTOWER_CLEANUP=true`
   supprime aussi les anciennes images pour éviter d'encombrer le disque).

Pour vérifier qu'une mise à jour a bien été appliquée :

```bash
docker compose logs -f watchtower
docker compose ps
```

## 3 - Vérification / dépannage

- Suivi du pipeline : onglet **Actions** du dépôt GitHub.
- Images publiées : onglet **Packages** du dépôt GitHub.
- Si `watchtower` ne détecte pas de mise à jour : vérifier que le label
  `com.centurylinklabs.watchtower.enable=true` est bien présent sur le conteneur
  (`docker inspect backend --format '{{json .Config.Labels}}'`) et que
  l'authentification `ghcr.io` sur la VM est toujours valide (les tokens
  expirent).

- Mise à jour forcée :

  ```bash
  docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
  docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
  ```
