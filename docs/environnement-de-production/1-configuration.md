# Configuration de l'environnement de production

> Cette procédure constitue une base proposée à des fins pédagogiques. Elle peut être librement adaptée en fonction des contraintes et des spécificités du contexte réel de mise en production.

__Attention, les étapes doivent être rigoureusement réalisées dans l'ordre indiqué.__

__Il est préférable d'exécuter chaque ligne de commande individuellement plutôt que d'effectuer des copier/coller de blocs de lignes de commande.__

## Accès au serveur fourni par l'organisme de formation

- VM : chaque étudiant dispose d'une VM personnelle
- Identifiant : chaque étudiant dispose d'un identifiant personnel
- Domaine : à renseigner selon l'environnement attribué
- Portail Web pour accès à la VM __hors réseau de l'organisme de formation__ : <https://guacamole.stagiairesmns.fr/guacamole/>
- SSH pour accès à la VM __depuis le réseau de l'organisme de formation__

## 1 - Première connexion au serveur en SSH

```bash
ssh <user>@<ip>
```

```bash
The authenticity of host '<ip> (<ip>)' can't be established.
ED25519 key fingerprint is: <key>
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

- Répondre : __yes__

```bash
Warning: Permanently added '<ip>' (ED25519) to the list of known hosts.
```

## 2 - Installation de la locale en_US.UTF-8

```bash
sudo nano /etc/locale.gen
```

- Décommenter la ligne ci-dessous :

```bash
# en_US.UTF-8 UTF-8
```

- Fermer et enregistrer le fichier avec les raccourcis clavier (identiques Linux / Mac / Windows)

CTRL + X
CTRL + Y

```bash
en_US.UTF-8 UTF-8
```

- Générer la locale

```bash
sudo locale-gen
```

- Mettre à jour la configuration système

```bash
sudo update-locale LANG=en_US.UTF-8
```

- Se déconnecter du serveur

```bash
exit
```

- Se re-connecter au serveur en SSH (cf. étape 1)

## 3 - Configuration du fuseau horaire (Europe/Paris)

```bash
sudo timedatectl set-timezone Europe/Paris
```

- Vérifier que le fuseau horaire est bien appliqué

```bash
timedatectl
```

doit afficher `Time zone: Europe/Paris (CET, +0100)` (ou `CEST, +0200` en heure d'été).

## 4 - Mise à jour du mot de passe de l'utilisateur root - FACULTATIF POUR L'EXERCICE

__Ne pas effectuer de modification de mot de passe sur la VM.__

```bash
passwd
```

## 5 - Mise à jour du système d'exploitation

```bash
sudo apt update && sudo apt upgrade
```

- Valider :

Y

## 6 - Mises à jour de sécurité automatiques

- Installer et configurer `unattended-upgrades` pour appliquer automatiquement les correctifs de sécurité

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

- Valider : sélectionner Yes puis taper sur la touche Enter

## 7 - Création d'un compte utilisateur non-privilégié pour l'application

- Créer un utilisateur (ex: goeasy)

```bash
sudo adduser <username>
```

- Saisir mot de passe

- Valider tous les champs en tapant sur la touche Enter puis Y

- Ajouter l'utilisateur au groupe __sudo__

```bash
sudo usermod -aG sudo <username>
```

- Changer d'utilisateur en conservant le rôle sudo

```bash
sudo su <username>
```

## 8 - Configuration d'une paire de clés SSH - FACULTATIF POUR L'EXERCICE

- Depuis la machine du développeur

```bash
cd ~
ssh-keygen -t ed25519 -a 100
```

- Saisir le nom de la clé SSH (ex: goeasy)

- Saisir et confirmer un mot de passe associé à la clé SSH

- Ajouter les informations du serveur dans `~/.ssh/config`

```bash
sudo nano ~/.ssh/config
```

```bash
Host <nom-du-serveur-ou-du-projet>
  Hostname <ip-du-serveur-ou-nom-de-domaine>
  IdentityFile ~/.ssh/<nom-de-la-cle-ssh>
  User <compte-utilisateur-sur-le-serveur>
```

- Copier la clé publique SSH sur le serveur distant (ex: goeasy):

```bash
ssh-copy-id <nom-du-serveur-ou-du-projet>
```

- Saisir le mot de passe du compte utilisateur distant préalablement défini sur le serveur distant et renseigné à la sous-étape précédente

- La clé publique SSH est ajoutée sur le serveur distant dans le fichier `~/.ssh/authorized_keys`

- A présent, la connexion au serveur en SSH ne nécessite plus de renseigner l'adresse IP du serveur ni l'utilisateur et son mot de passe :

```bash
ssh <nom-de-la-cle>
```

## 9 - Configuration fail2ban - FACULTATIF POUR L'EXERCICE

- Installer `fail2ban`, un outil qui bannit temporairement les adresses IP à l'origine de tentatives de connexion infructueuses répétées (protection contre les attaques par force brute, notamment sur SSH)

```bash
sudo apt install fail2ban
```

- Créer un fichier de configuration local `jail.local` en copiant le fichier par défaut `jail.conf`, afin de ne jamais modifier directement ce dernier (il est écrasé lors des mises à jour du paquet)

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

```bash
sudo nano /etc/fail2ban/jail.local
```

- Repérer la section `[sshd]` déjà présente plus bas dans le fichier (ne pas en créer une nouvelle : `jail.local` est une copie intégrale de `jail.conf`, qui contient déjà cette section) et y activer la prison dédiée à SSH

```bash
[sshd]
enabled = true
```

> ⚠️ Si `fail2ban` refuse de démarrer avec l'erreur `section 'sshd' already exists`, c'est qu'une section `[sshd]` a été ajoutée en double au lieu de modifier celle déjà présente. Repérer les deux occurrences avec `sudo grep -n '^\[sshd\]' /etc/fail2ban/jail.local` et n'en garder qu'une.

- Fermer et enregistrer le fichier avec les raccourcis clavier

CTRL + X
CTRL + Y

- Redémarrer le service pour appliquer la configuration

```bash
sudo systemctl restart fail2ban
```

- Faire en sorte que fail2ban démarre automatiquement au chargement du système

```bash
sudo systemctl enable fail2ban
```

- Vérifier que le service est actif

```bash
sudo systemctl status fail2ban
```

- Sortir `:q`

- Vérifier l'état de la prison SSH

```bash
sudo fail2ban-client status sshd
```

doit afficher :

```bash
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     0
|  `- Journal matches:  _SYSTEMD_UNIT=sshd.service + _COMM=sshd
`- Actions
   |- Currently banned: 0
   |- Total banned: 0
   `- Banned IP list:
```

## 10 - Configuration du pare-feu (ufw) - FACULTATIF POUR L'EXERCICE

- Installer UFW

```bash
sudo apt install ufw
```

- Autoriser les connexions SSH avant d'activer le pare-feu, pour ne pas perdre l'accès au serveur

```bash
sudo ufw allow OpenSSH
```

- Activer le pare-feu

```bash
sudo ufw enable
```

- Valider en tapant sur la touche __y__

- Vérifier les règles actives

```bash
sudo ufw status
```

doit afficher :

```bash
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere                  
OpenSSH (v6)               ALLOW       Anywhere (v6)      
```

> À noter pour la suite : quand l'application sera exposée (reverse proxy, HTTP/HTTPS), il faudra ajouter sudo ufw allow 80,443/tcp. Le chiffrement HTTPS/TLS lui-même est géré en amont par l'infrastructure de l'organisme de formation : aucune configuration de certificat n'est à réaliser sur ce serveur.

## 11 - Installer Docker

```bash
# Add Docker's official GPG key

sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

- Valider en tapant sur la touche __Y__

- Vérifier que Docker fonctionne

```bash
sudo systemctl status docker
```

- Sortir `:q`

- Tester un conteneur

```bash
sudo docker run hello-world
```

doit afficher

```bash
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
4f55086f7dd0: Pull complete 
d5e71e642bf5: Download complete 
Digest: sha256:c3cbe1cc1aa588a64951ac6286e0df7b27fe2e6324b1001c619bb358770c0178
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

- Appliquer les recommandations "Linux post-installation steps for Docker Engine" ci-dessous
(<https://docs.docker.com/engine/install/linux-postinstall/>)

- Créer un groupe __docker__

```bash
sudo groupadd docker
```

Si le groupe docker existe déjà, affiche :

```bash
groupadd: group 'docker' already exists
```

- Ajout de l'utilisateur courant (ex: goeasy) au groupe __docker__

```bash
sudo usermod -aG docker $USER
```

- Activer l'appartenance de l'utilisateur courant au groupe __docker__

```bash
newgrp docker
```

- Vérifier que l'utilisateur courant peut démarrer un container Docker sans la commande sudo

```bash
docker run hello-world
```

doit afficher :

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

- Faire en sorte que Docker démarre automatiquement au chargement du système

```bash
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

## 12 - Installation de Git

```bash
sudo apt install git
```

## 13 - Installation initiale de l'application

cf. [2-installation.md](2-installation.md)

---

## A noter

Dans les commandes Bash fournies en exemple, les expressions entourées par des chevrons (<>) doivent être remplacés par la valeur de votre choix, en prenant soin de bien retirer les chevrons, exemple :

```bash
ssh <nom-de-la-cle-ssh>
```

Si la clé SSH se nomme *helloworld*, la commande à exécuter devient

```bash
ssh helloworld
```
