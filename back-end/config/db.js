// back-end/config/db.js

const { PrismaClient } = require('@prisma/client');

// Inicializa o cliente Prisma.
// Ele usará a DATABASE_URL que está no seu .env.
const prisma = new PrismaClient();

module.exports = prisma;