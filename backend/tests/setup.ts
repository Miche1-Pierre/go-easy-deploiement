// Exécuté par Jest avant chaque fichier de test (voir jest.config.js).
// Fournit des variables d'environnement déterministes pour que les tests ne
// dépendent jamais d'un fichier backend/.env local (absent en CI).
process.env.NODE_ENV ??= "test";
process.env.JWT_SECRET ??= "test-jwt-secret";
process.env.JWT_EXPIRES_IN ??= "1h";
process.env.SESSION_SECRET ??= "test-session-secret";
process.env.CORS_ORIGINS ??= "http://localhost";
