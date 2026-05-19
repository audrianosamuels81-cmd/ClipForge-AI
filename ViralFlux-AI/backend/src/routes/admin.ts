import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalVideos, totalExports, activeSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.video.count(),
      prisma.export.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ]);

    const revenue = await prisma.billingRecord.aggregate({
      _sum: { amount: true },
      where: { status: 'succeeded' },
    });

    res.json({
      stats: {
        totalUsers,
        totalVideos,
        totalExports,
        activeSubscriptions,
        totalRevenue: revenue._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// List all users
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subscription: {
            select: { plan: true, status: true },
          },
          _count: {
            select: { videos: true, exports: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Feature flags
router.get('/features', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const flags = await prisma.featureFlag.findMany();
    res.json({ flags });
  } catch (error) {
    console.error('Admin features error:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

router.patch('/features/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const flag = await prisma.featureFlag.update({
      where: { id },
      data: { enabled },
    });

    res.json({ flag });
  } catch (error) {
    console.error('Admin update feature error:', error);
    res.status(500).json({ error: 'Failed to update feature' });
  }
});

// Support tickets
router.get('/tickets', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    res.json({ tickets });
  } catch (error) {
    console.error('Admin tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

export default router;
