const {prisma}=require('../config/database');
const {redisClient}=require('../config/redis');
module.exports=async(req,res,next)=>{
 try{
  const organizationId=req.organization.id;
  const month=new Date().toISOString().slice(0,7);
  const subscription=await prisma.subscription.findUnique({where:{organizationId},include:{plan:true}});
  const current=await prisma.usageCounter.findUnique({where:{organizationId_month:{organizationId,month}}});
  if(subscription && current && current.apiRequests>=subscription.plan.apiRequestLimit){
   return res.status(429).json({success:false,code:'API_LIMIT',message:`Your ${subscription.plan.name} plan API request limit has been reached. Upgrade your plan or wait until next month.`});
  }
  await prisma.usageCounter.upsert({where:{organizationId_month:{organizationId,month}},update:{apiRequests:{increment:1}},create:{organizationId,month,apiRequests:1}});
  if(redisClient.isReady) await redisClient.incr(`usage:${organizationId}:${month}`);
 }catch(e){console.error('Usage counter:',e.message)}
 next();
};
