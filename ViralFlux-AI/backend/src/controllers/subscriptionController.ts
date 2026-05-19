import { Response } from 'express';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const PLANS = {
  FREE: { exports: 3, maxDuration: 15, teamSeats: 1, aiGenerations: 10, watermark: true, price: 0 },
  CREATOR: { exports: 50, maxDuration: 60, teamSeats: 1, aiGenerations: 200, watermark: false, price: 29 },
  PRO: { exports: 200, maxDuration: 180, teamSeats: 3, aiGenerations: 500, watermark: false, price: 79 },
  AGENCY: { exports: -1, maxDuration: 360, teamSeats: 15, aiGenerations: -1, watermark: false, price: 199 },
};

export function getPlanLimits(plan: string) {
  return PLANS[plan as keyof typeof PLANS] || PLANS.FREE;
}

export async function getSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!subscription) {
      res.status(404).json({ error: 'No subscription found' });
      return;
    }

    const limits = getPlanLimits(subscription.plan);

    // Get current usage
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const exportsCount = await prisma.export.count({
      where: {
        userId: req.userId,
        createdAt: { gte: currentMonth },
      },
    });

    const aiGenerationsCount = await prisma.aiGeneration.count({
      where: {
        userId: req.userId,
        createdAt: { gte: currentMonth },
      },
    });

    res.json({
      subscription,
      limits,
      usage: {
        exports: exportsCount,
        exportsRemaining: limits.exports === -1 ? -1 : limits.exports - exportsCount,
        aiGenerations: aiGenerationsCount,
        aiGenerationsRemaining: limits.aiGenerations === -1 ? -1 : limits.aiGenerations - aiGenerationsCount,
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
}

export async function upgradePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { plan, interval } = req.body;

    if (!['CREATOR', 'PRO', 'AGENCY'].includes(plan)) {
      res.status(400).json({ error: 'Invalid plan selected' });
      return;
    }

    if (!['MONTHLY', 'YEARLY'].includes(interval)) {
      res.status(400).json({ error: 'Invalid billing interval' });
      return;
    }

    // TODO: Create checkout session with Lemon Squeezy / Paddle
    // const checkoutUrl = await createCheckoutSession(userId, plan, interval);

    res.json({
      message: 'Redirecting to checkout...',
      // checkoutUrl,
    });
  } catch (error) {
    console.error('Upgrade plan error:', error);
    res.status(500).json({ error: 'Failed to upgrade plan' });
  }
}

export async function cancelSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId },
    });

    if (!subscription) {
      res.status(404).json({ error: 'No active subscription' });
      return;
    }

    // TODO: Cancel with billing provider
    // await cancelBillingSubscription(subscription.providerId);

    await prisma.subscription.update({
      where: { userId: req.userId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });

    res.json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}

export async function getBillingHistory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const records = await prisma.billingRecord.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ records });
  } catch (error) {
    console.error('Get billing history error:', error);
    res.status(500).json({ error: 'Failed to fetch billing history' });
  }
}

export async function handleWebhook(req: AuthRequest, res: Response): Promise<void> {
  try {
    const signature = req.headers['x-signature'] as string;
    const payload = req.body;

    // TODO: Verify webhook signature based on provider
    // if (!verifyWebhookSignature(payload, signature, env.LEMONSQUEEZY_WEBHOOK_SECRET)) {
    //   res.status(401).json({ error: 'Invalid signature' });
    //   return;
    // }

    // Handle different event types
    const eventType = payload.meta?.event_name || payload.event_type;

    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_cancelled':
        // Update subscription status
        break;
      case 'payment_succeeded':
        // Create billing record
        break;
      case 'payment_failed':
        // Mark subscription as past_due
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
