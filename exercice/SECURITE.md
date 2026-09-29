# Sécurité

Renseigner ici les failles de sécurité et bugs détectés, et les solutions correctives appliquées.

__L'application contient **13 failles de sécurité.**__

## Pistes de recherche (liste non exhaustive)

> ⚠️ Ces questions sont des indices qui doivent vous orienter dans votre recherche de failles de sécurité et de bugs. Vous ne devez pas simplement répondre aux questions, mais détecter les problèmes liés, les consigner et les corriger. Ces indices ne couvrent __pas toutes__ les failles présentes dans l'application. D'autres restent à découvrir par vos propres moyens (lecture du code, tests manuels...). Ne vous arrêtez pas à cette liste.

### Contrôle d'accès

- __Contrôle d'accès sur les réservations__ : un touriste peut-il agir sur la réservation d'un autre utilisateur ? Comment l'identité "courante" est-elle déterminée sur les routes qui listent ou modifient une réservation ?

- __Droits sur la gestion des activités__ : la création, la modification et la suppression d'activités sont-elles réservées au bon rôle, ou suffit-il d'être authentifié ?

- __Recherche d'activités__ : que se passe-t-il si le paramètre de recherche contient des caractères inattendus ?

- __Affichage des données dans le back-office__ : les champs saisis par les utilisateurs (titre d'activité, nom de client...) sont-ils correctement neutralisés avant d'être affichés ?

- __Inscription__ : un champ du formulaire d'inscription permet-il d'obtenir plus de droits que prévu ?

- __Réponses de l'API__ : des informations sensibles (mots de passe, hash, détails d'erreur internes) apparaissent-elles dans les réponses JSON ?

- __Configuration CORS__ : quels sites sont autorisés à appeler l'API avec les identifiants de session ?

- __Prix et dates de réservation__ : le prix et la disponibilité temporelle d'une activité sont-ils revérifiés côté serveur, ou fait-on confiance à ce qu'envoie le client ?

- __Réservations concurrentes__ : que se passe-t-il si plusieurs réservations arrivent simultanément sur une activité presque complète ?

- __Dépendances NPM__ : Les dépendances NPM du `backend` et du `front-office` contiennent-elles des vulnérabilités connues ? Un outil d'audit permet-il de les lister et de les corriger ?

## Hors périmètre

Les points suivants sont déjà correctement configurés (infrastructure fournie par l'organisme, procédures et fichiers de configuration livrés avec le projet). Ne passez pas de temps à les auditer, à les reconfigurer ou à les renforcer :

- __HTTPS/TLS sur la VM de formation__ : le chiffrement du trafic est géré en amont par l'infrastructure de l'organisme de formation (reverse proxy externe). Le conteneur `nginx` ne sert que du HTTP sur le port 80 et propage l'en-tête `X-Forwarded-Proto` (sur lequel le backend s'appuie pour poser le cookie de session `Secure`). Aucune configuration de certificat (Let's Encrypt, Certbot...) n'est à réaliser sur le serveur.

- __Durcissement du système d'exploitation__ : la procédure de configuration est complète et correcte. Elle met en place les mises à jour de sécurité automatiques (`unattended-upgrades`), un compte système non privilégié dédié à l'application, la connexion SSH par clé, `fail2ban` sur SSH (anti-force brute) et le pare-feu `ufw` n'ouvrant que le strict nécessaire (OpenSSH, puis 80/443). Appliquez-la telle quelle : inutile d'ajouter des règles `ufw`, de changer le port SSH ou de retoucher les jails `fail2ban`.

- __Chaîne de déploiement (CI/CD)__ : le pipeline GitHub Actions, la publication des images sur `ghcr.io` et la mise à jour automatique par `watchtower` (modèle *pull* : aucun identifiant d'accès à la VM n'est stocké côté GitHub) sont fournis et fonctionnels. Rien à auditer ni à sécuriser côté pipeline.

- __Exposition réseau des conteneurs__ : seul le conteneur `nginx` publie un port sur l'hôte (80). La base MariaDB n'est jamais exposée : elle n'est joignable que sur le réseau Docker interne `go-easy.net`. Il n'y a pas de port de base de données à « fermer ».

- Protection CSRF sur le back-office (vérification `Origin`/`Referer`)

- Rate limiting sur les routes de connexion

- Durcissement du cookie de session (`HttpOnly`, `SameSite`, `Secure`)

- Validation des secrets d'environnement au démarrage en production

- Configuration TypeORM (migrations, pas de synchronisation automatique du schéma)

- Exécution du conteneur applicatif avec un utilisateur non-root

- Absence du middleware `helmet` : ce n'est pas une faille à corriger dans le cadre de cet exercice

- Stockage du JWT du front-office en `localStorage` : c'est un choix assumé pour ce projet simplifié, pas une faille à corriger ici

- Une éventuelle alerte `npm audit` sur `react-router-dom` concernant le mode RSC/Server Actions : cette SPA utilise `BrowserRouter` en rendu client et n'active aucun de ces chemins, donc ne changez pas de version pour ce seul motif - vérifiez plutôt qu'aucune autre alerte réellement exploitable ne subsiste.
