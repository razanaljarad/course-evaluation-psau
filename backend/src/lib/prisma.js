const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const ssl = connectionString.includes('render.com') || connectionString.includes('amazonaws.com')
  ? { rejectUnauthorized: false }
  : false;

const adapter = new PrismaPg({ connectionString, ssl });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
