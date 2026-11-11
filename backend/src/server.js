const app=require('./app');const env=require('./config/env');const {connectDatabase}=require('./config/database');const {connectRedis}=require('./config/redis');
(async()=>{try{await connectDatabase();await connectRedis();app.listen(env.port,()=>console.log(`FlowSuite API listening on ${env.port}`))}catch(e){console.error('Startup failed',e);process.exit(1)}})();
