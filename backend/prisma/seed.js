const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
async function main() {
  const defs = [
    {code:'FREE',name:'Free',pricePaise:0,seatLimit:3,projectLimit:2,apiRequestLimit:1000},
    {code:'STARTER',name:'Starter',pricePaise:49900,seatLimit:10,projectLimit:20,apiRequestLimit:10000},
    {code:'PROFESSIONAL',name:'Professional',pricePaise:99900,seatLimit:50,projectLimit:null,apiRequestLimit:100000}
  ];
  for (const p of defs) await prisma.plan.upsert({where:{code:p.code},update:p,create:p});
  const ent = await prisma.entitlement.upsert({where:{code:'ADVANCED_ANALYTICS'},update:{},create:{code:'ADVANCED_ANALYTICS',description:'Access advanced analytics'}});
  const pro = await prisma.plan.findUnique({where:{code:'PROFESSIONAL'}});
  await prisma.planEntitlement.upsert({where:{planId_entitlementId:{planId:pro.id,entitlementId:ent.id}},update:{enabled:true},create:{planId:pro.id,entitlementId:ent.id,enabled:true}});
  for (const p of ['FREE','STARTER']) { const plan=await prisma.plan.findUnique({where:{code:p}}); await prisma.planEntitlement.upsert({where:{planId_entitlementId:{planId:plan.id,entitlementId:ent.id}},update:{enabled:false},create:{planId:plan.id,entitlementId:ent.id,enabled:false}}); }
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(async()=>{await prisma.$disconnect();await pool.end()});
