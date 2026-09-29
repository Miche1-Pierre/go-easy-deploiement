# Consignes de l'exercice

## Accès au projet

- Accepter l'invitation GitHub Classroom transmise par l'organisme de formation : elle crée automatiquement votre dépôt personnel (privé), initialisé à partir du dépôt du projet.
- Cloner ce dépôt Classroom sur votre machine de développement, puis à nouveau sur votre VM de production lors de l'installation (cf. [2-installation.md, étape 1](../docs/environnement-de-production/2-installation.md)) : c'est le même dépôt qui doit être utilisé sur les deux.
- L'ensemble de votre travail (code, `CHANGELOG.md`, fichiers `exercice/*.md`) doit être commité et poussé (`git push`) sur la branche `main` de ce dépôt Classroom : c'est ce qui sera évalué, et c'est également ce qui déclenche le pipeline CI/CD qui construit et publie les images utilisées lors du déploiement.

## Objectifs

- Configurer un environnement de production sécurisé sur une machine distante (Linux, Debian 13)
- Détecter et corriger les failles de sécurité et bugs d'une application web full stack
- Déployer une application web full stack sur l'environnement de production

## Déroulé de l'exercice

### 1ère partie (1h)

- Prendre connaissance du projet (documentation, architecture, stack technologique, fonctionnalités, code, variables d'environnement...)
- Paramétrer votre environnement d'exécution local pour tester le projet
- Préparer le déploiement de l'application en production sur votre machine dédiée en rédigeant votre procédure de déploiement dans le fichier `exercice/DEPLOIEMENT.md`
- Répondre aux questions dans `exercice/QUESTIONS.md`

### 2ème partie (2h)

- Détecter et corriger les failles de sécurité et bugs (attention : toutes les failles ne sont pas répértoriées dans `exercice/SECURITE.md`)
- Mettre à jour le fichier `CHANGELOG.md`
- Déployer le correctif de l'application sur l'environnement de production
