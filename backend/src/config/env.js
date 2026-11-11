require('dotenv').config();
const required=['DATABASE_URL','JWT_ACCESS_SECRET','JWT_REFRESH_SECRET'];
for (const key of required) if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`);
module.exports={port:Number(process.env.PORT||5000),databaseUrl:process.env.DATABASE_URL,redisUrl:process.env.REDIS_URL||'redis://localhost:6379',accessSecret:process.env.JWT_ACCESS_SECRET,refreshSecret:process.env.JWT_REFRESH_SECRET,accessExpires:process.env.JWT_ACCESS_EXPIRES_IN||'15m',refreshExpires:process.env.JWT_REFRESH_EXPIRES_IN||'7d',frontendUrl:process.env.FRONTEND_URL||'http://localhost:5173',nodeEnv:process.env.NODE_ENV||'development',stripeSecret:process.env.STRIPE_SECRET_KEY, stripeWebhookSecret:process.env.STRIPE_WEBHOOK_SECRET};
