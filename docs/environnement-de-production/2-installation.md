# Installation initiale de l'application

> Cette procédure constitue une base proposée à des fins pédagogiques. Elle peut être librement adaptée en fonction des contraintes et des spécificités du contexte réel de mise en production.

Suite de la [configuration de l'environnement de production](1-configuration.md).
Cette procédure suppose que le serveur est configuré (utilisateur non-privilégié,
clé SSH, pare-feu, Docker, Git) et se réalise en une seule fois, lors de la mise en
service du serveur.

__Attention, les étapes doivent être rigoureusement réalisées dans l'ordre indiqué.__

__Il est préférable d'exécuter chaque ligne de commande individuellement plutôt que d'effectuer des copier/coller de blocs de lignes de commande.__

## 1 - Prendre l'utilisateur non-privilégié

- Changer d'utilisateur en conservant le rôle sudo

```bash
sudo su <username>
```

Se placer dans le répertoire dédié à l'utilisateur courant :

```bash
cd
```

## 2 - Cloner le dépôt

Chaque étudiant dispose d'un dépôt GitHub Classroom dédié, préconfiguré par l'organisme de formation à partir du dépôt du projet.

```bash
git clone <url-du-depot-github-classroom>
cd go-easy
```

- Renseigner son identifiant GitHub
- Renseigner son mot de passe GitHub

## 3 - Configurer les variables d'environnement

- Copier les fichiers d'exemple :

```bash
cp backend/.env.example backend/.env
cp db/.env.example db/.env
```

- Ouvrir le fichier le fichier `backend/.env` avec nano

```bash
nano backend/.env
```

- Renseigner  :
  - `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
  - `JWT_SECRET` et `SESSION_SECRET` : générer deux secrets aléatoires distincts d'au moins 32 caractères
  - `SEED_ADMIN_PASSWORD`, `SEED_TOURIST_PASSWORD` : mots de passe des comptes de démonstration créés à l'étape 9
  - `DB_HOST` et `CORS_ORIGINS` : ne pas modifier (déjà renseignés)

- Ouvrir le fichier le fichier `backend/.env` avec nano

```bash
nano db/.env
```

- Renseigner `db/.env` :
  - `MARIADB_DATABASE`, `MARIADB_USER`, `MARIADB_PASSWORD`, `MARIADB_ROOT_PASSWORD`

> __Important__ : `DB_NAME`, `DB_USERNAME` et `DB_PASSWORD` dans `backend/.env`
 doivent être __identiques__ à `MARIADB_DATABASE`, `MARIADB_USER` et
 `MARIADB_PASSWORD` dans `db/.env`. C'est ce qui permet au backend de
 s'authentifier sur la base créée par le conteneur `db` au premier démarrage.
 Une valeur différente entraîne une erreur de connexion (accès refusé ou base introuvable).

## 4 - Adapter les images Docker (docker-compose.prod.yml)

- Éditer `docker-compose.prod.yml` et remplacer `<compte-github>` par le nom
  du compte (ou de l'organisation) GitHub sous lequel le dépôt GitHub
  Classroom a été créé, sur les deux lignes commentées
  `#ADAPTER UNIQUEMENT ICI` :

```yaml
image: ghcr.io/<compte-github>/go-easy-backend:latest #ADAPTER UNIQUEMENT ICI
image: ghcr.io/<compte-github>/go-easy-front-office:latest ##ADAPTER UNIQUEMENT ICI
```

> __À noter__ : c'est ce compte GitHub qui a publié les images sur `ghcr.io`
> via la CI (cf. [pipeline CI/CD](../deploiement/cicd.md)). Le nom doit
> correspondre exactement au propriétaire du dépôt (respecter la casse), sans
> quoi `docker compose pull` échouera (image introuvable) à l'étape 8.

## 5 - Adapter la configuration NGINX

- Éditer `nginx/nginx.conf` et remplacer le nom de domaine sur la ligne
  commentée `#ADAPTER UNIQUEMENT ICI` par le domaine réel du serveur :

```nginx
server_name <domaine-du-serveur>;#ADAPTER UNIQUEMENT ICI
```

> __À noter__ : le conteneur `nginx` ne sert que du HTTP (port 80). Le
> chiffrement HTTPS/TLS est géré en amont par l'infrastructure de l'organisme
> de formation (reverse proxy externe) : aucune configuration de certificat
> (Let's Encrypt, Certbot, etc.) n'est à réaliser par l'étudiant sur ce
> serveur.

## 6 - GHCR (GitHub Container Registry)

Les images `backend` et `front-office` sont publiées sur `ghcr.io` par la CI
(cf. [pipeline CI/CD](../deploiement/cicd.md)).

Par défaut, les packages du dépôt contenant les images Docker sont privés.

Dans le cadre de ce projet pédagogique, il est plus pratique de rendre les packages
publics (GitHub → onglet __Packages__ du dépôt → __Package settings__ →
__Change visibility__). Dans ce cas, aucune authentification n'est nécessaire
sur le serveur.

La visibilité d'un package GHCR est indépendante de celle du dépôt : un
package peut être rendu public même si le dépôt GitHub Classroom qui l'a
publié reste privé. Seules les images Docker deviennent alors accessibles
publiquement (le code source du dépôt, lui, reste privé).

### S'authentifier auprès du registre GHCR

Si les packages du dépôt sont privés (comportement par défaut), le serveur doit s'authentifier pour pouvoir
les récupérer :

```bash
echo <PAT-avec-scope-read:packages> | docker login ghcr.io -u <utilisateur-github> --password-stdin
```

## 7 - Vérification des ports 80/443

- Vérifier qu'aucun service n'écoute plus sur les ports 80/443 :

```bash
sudo ss -tlnp | grep -E ':80|:443'
```

la commande ne doit rien retourner.

### Si les ports 80 et 443 sont déjà occupés

Dans le cas où Apache aurait été installé et activé par défaut, il faut le désactiver afin de libérer les ports 80 et 443 :

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
```

## 8 - Ouvrir les ports HTTP/HTTPS (ufw)

Le conteneur `nginx` va exposer l'application sur les ports 80/443 : ouvrir
ces ports dans le pare-feu avant de démarrer les services (cf.
[1-configuration.md, étape 9](1-configuration.md)) :

```bash
sudo ufw allow 80,443/tcp
```

- Vérifier les règles actives

```bash
sudo ufw status
```

doit désormais afficher, en plus d'OpenSSH, une règle `80,443/tcp ALLOW Anywhere`.

## 9 - Démarrer les services

Les images `backend` et `front-office` sont construites par la CI : le
serveur ne les build __jamais__ lui-même, il les récupère uniquement.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 10 - Initialiser la base de données

```bash
docker compose exec backend npm run seed
```

Cette commande crée notamment 2 comptes de démonstration :

- Compte client (front office) : `<SEED_TOURIST_LOGIN> / <SEED_TOURIST_PASSWORD>`
- Compte admin (back office) : `<SEED_ADMIN_LOGIN> / <SEED_ADMIN_PASSWORD>`

## 11 - Vérifications

- `docker compose ps` indique que tous les services sont démarrés (`db`, `backend`, `front-office`, `nginx`, `watchtower`)
- `http://<domaine-du-serveur>/` affiche le catalogue StayEasy
- `http://<domaine-du-serveur>/api/health` retourne un état sain
- `http://<domaine-du-serveur>/admin` affiche l'authentification du back-office

## 12 - Mises à jour

L'installation initiale est terminée. Les mises à jour suivantes sont
automatiques (`watchtower` récupère les nouvelles images publiées par la CI) :
voir la [procédure de déploiement](../deploiement/procedure-de-deploiement.md)
et le [pipeline CI/CD](../deploiement/cicd.md).
