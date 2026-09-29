# GoEasy - Exercice (contient des failles de sécurité)

> **Attention :** pour les besoins de cet exercice, ce projet contient des failles de sécurité volontairement introduites. Il ne doit pas être déployé sur Internet ni utilisé avec des données réelles. L'objectif est d'identifier, d'exploiter dans un environnement isolé, puis de corriger ces vulnérabilités.

Ce projet est une version simplifiée de l’épreuve d’examen, conçue pour vous permettre de vous entraîner dans le cadre de votre formation initiale.

Consulter le fichier `exercice/CONSIGNES.md`.

## À propos

**GoEasy** est une plateforme touristique fictive fournie à des fins pédagogiques. Les visiteurs consultent des activités par ville ou catégorie, réservent une ou plusieurs places, suivent leurs réservations et peuvent les annuler. Les administrateurs gèrent le catalogue et les réservations dans un back office.

## Stack

- Front-office : React, TypeScript, Vite, React Router et Axios
- API REST : Node.js, TypeScript, Express, TypeORM et JWT
- Back office SSR : Express, EJS et sessions
- Base de données : MariaDB
- Infrastructure : Docker Compose et NGINX
- Tests : Jest et Bruno

## Services et accès

| URL | Service |
| --- | --- |
| `http://localhost/` | Front-office React |
| `http://localhost/api/` | API REST |
| `http://localhost/admin/` | Back-office EJS |

## Configuration

Renseigner `backend/.env`, `db/.env`, `front-office/.env` et `nginx/nginx.conf`, puis lancer :

```bash
docker compose up --build
docker compose exec backend npm run seed:dev
```

En production :

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
docker compose exec backend npm run seed
```

Les identifiants de démonstration sont configurés par les variables `SEED_ADMIN_LOGIN`, `SEED_ADMIN_PASSWORD`, `SEED_TOURIST_LOGIN` et `SEED_TOURIST_PASSWORD`.

## API REST

Les routes protégées attendent `Authorization: Bearer <token>`.

| Méthode | Route | Accès | Description |
| --- | --- | --- | --- |
| GET | `/health` | public | État de l'API |
| POST | `/auth/register` | public | Inscription d'un touriste |
| POST | `/auth/login` | public | Connexion |
| GET | `/auth/me` | authentifié | Profil courant |
| GET | `/activities` | public | Liste, filtres `city` et `category` |
| GET | `/activities/:id` | public | Détail d'une activité |
| POST | `/activities` | admin | Création |
| PUT | `/activities/:id` | admin | Modification |
| DELETE | `/activities/:id` | admin | Suppression |
| POST | `/bookings` | authentifié | Réservation de places |
| GET | `/bookings/me` | authentifié | Réservations courantes |
| PATCH | `/bookings/:id/cancel` | authentifié | Annulation |
| GET | `/bookings` | admin | Toutes les réservations |

Exemple de réservation :

```json
{ "activityId": 1, "participants": 2 }
```

Le serveur refuse les activités passées et les réservations dépassant la capacité restante. Le prix total est calculé côté serveur.

--

!["Logotype Shrp"](https://sherpa.one/images/sherpa-logotype.png)

**Alexandre Leroux**  
_Enseignant / Formateur_  
_Développeur logiciel web & mobile_

Nancy (Grand Est, France)

<https://shrp.dev>
