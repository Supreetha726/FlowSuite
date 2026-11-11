const express=require('express');const cors=require('cors');const helmet=require('helmet');const env=require('./config/env');const auth=require('./middleware/auth');const usage=require('./middleware/usage');const error=require('./middleware/error');
const app=express();app.use(helmet());app.use(cors({origin:env.frontendUrl,credentials:true}));
// Stripe requires the raw request body for signature verification.
app.post('/api/billing/webhook',express.raw({type:'application/json'}),async(req,res)=>{try{if(!env.stripeSecret||!env.stripeWebhookSecret)return res.status(503).send('Stripe is not configured');const Stripe=require('stripe');const stripe=new Stripe(env.stripeSecret);const event=stripe.webhooks.constructEvent(req.body,req.headers['stripe-signature'],env.stripeWebhookSecret);if(event.type==='checkout.session.completed'){const s=event.data.object;const orgId=s.metadata?.organizationId,planId=s.metadata?.planId;if(orgId&&planId){await require('./config/database').prisma.subscription.update({where:{organizationId:orgId},data:{planId,status:'ACTIVE',stripeSubscriptionId:s.subscription}});await require('./utils/audit').audit({organizationId:orgId,action:'PLAN_CHANGED',targetType:'Subscription',metadata:{planId}})}}if(event.type==='invoice.payment_failed'){const s=event.data.object;await require('./config/database').prisma.subscription.updateMany({where:{stripeCustomerId:s.customer},data:{status:'PAST_DUE'}})}res.json({received:true})}catch(e){res.status(400).send(`Webhook Error: ${e.message}`)}});
app.use(express.json({limit:'1mb'}));app.use(express.urlencoded({extended:true}));app.get('/',(req,res)=>res.json({success:true,message:'Welcome to FlowSuite API'}));app.get('/api/health',(req,res)=>res.json({success:true,status:'healthy'}));
// Apply tenant authentication and API-plan enforcement to protected resource APIs.
app.use('/api', (req,res,next)=>{if(req.path.startsWith('/auth')||req.path.startsWith('/plans')||req.path.startsWith('/billing/webhook')||req.path==='/health')return next();require('./middleware/auth')(req,res,()=>require('./middleware/usage')(req,res,next));});
app.use('/api/auth',require('./routes/auth.routes'));
app.use('/api/plans',require('./routes/plans.routes'));
app.use('/api/members',require('./routes/members.routes'));
app.use('/api/projects',require('./routes/projects.routes'));
app.use('/api/tasks',require('./routes/tasks.routes'));
app.use('/api/customers',require('./routes/customers.routes'));
app.use('/api/billing',require('./routes/billing.routes'));
app.use('/api/usage',require('./routes/usage.routes'));
app.use('/api/audit',require('./routes/audit.routes'));
app.use(error);module.exports=app;
