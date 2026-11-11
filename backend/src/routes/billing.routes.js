const router = require('express').Router();
const { prisma } = require('../config/database');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const asyncHandler = require('../utils/asyncHandler');
const { audit } = require('../utils/audit');

router.use(auth);

// Local demonstration checkout: activates a plan without collecting payment.
// This endpoint is intended for project demos, not production billing.
router.post('/checkout', roles('OWNER'), asyncHandler(async (req, res) => {
  const planCode = String(req.body.planCode || '').toUpperCase();
  const plan = await prisma.plan.findUnique({ where: { code: planCode } });

  if (!plan || plan.code === 'FREE') {
    return res.status(400).json({ success: false, message: 'Choose a valid paid plan.' });
  }

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

  const subscription = await prisma.subscription.update({
    where: { organizationId: req.organization.id },
    data: {
      planId: plan.id,
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      currentPeriodEnd,
      // Demo subscriptions are not linked to Stripe.
      stripeCustomerId: null,
      stripeSubscriptionId: null
    },
    include: { plan: true }
  });

  await audit({
    organizationId: req.organization.id,
    actorId: req.user.id,
    action: 'DEMO_PLAN_ACTIVATED',
    targetType: 'Subscription',
    targetId: subscription.id,
    metadata: { planCode: plan.code, demoMode: true }
  });

  res.json({
    success: true,
    message: `${plan.name} plan activated successfully in demo mode. No payment was charged.`,
    data: subscription
  });
}));

router.get('/current', asyncHandler(async (req, res) => {
  const data = await prisma.subscription.findUnique({
    where: { organizationId: req.organization.id },
    include: { plan: true }
  });
  res.json({ success: true, data });
}));

module.exports = router;
