const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const env = require('./env');
const pool = new Pool({ connectionString: env.databaseUrl });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
async function connectDatabase(){ await prisma.$connect(); console.log('PostgreSQL connected'); }
async function disconnectDatabase(){ await prisma.$disconnect(); await pool.end(); }
module.exports={prisma,connectDatabase,disconnectDatabase};
