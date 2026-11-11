const {createClient}=require('redis'); const env=require('./env');
const redisClient=createClient({url:env.redisUrl}); redisClient.on('error',e=>console.error('Redis:',e.message));
async function connectRedis(){try{if(!redisClient.isOpen) await redisClient.connect();console.log('Redis connected')}catch(e){console.warn('Redis unavailable; continuing without cache:',e.message)}}
module.exports={redisClient,connectRedis};
