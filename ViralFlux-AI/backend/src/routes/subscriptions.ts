import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';
import {
  getSubscription,
  upgradePlan,
  cancelSubscription,
  getBillingHistory,
  handleWebhook,
} from '../controllers/subscriptionController';

const router = Router();

router.get('/', authenticate, getSubscription);
router.post('/upgrade', authenticate, upgradePlan);
router.post('/cancel', authenticate, cancelSubscription);
router.get('/billing-history', authenticate, getBillingHistory);
router.post('/webhook', apiLimiter, handleWebhook);

export default router;
