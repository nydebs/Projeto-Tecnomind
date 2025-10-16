// back-end/config/db.js

const { PrismaClient } = require('@prisma/client');

// Inicializa o cliente Prisma.
const prisma = new PrismaClient();

module.exports = prisma;