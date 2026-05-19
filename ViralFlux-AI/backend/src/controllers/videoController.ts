import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function uploadVideo(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No video file provided' });
      return;
    }

    const { originalname, mimetype, size, path, filename } = req.file;

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId },
    });

    if (!subscription || (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING')) {
      res.status(403).json({ error: 'No active subscription' });
      return;
    }

    // Check max file size based on plan
    const planLimits = getPlanLimits(subscription.plan);
    if (size > planLimits.maxDuration * 1024 * 1024) {
      res.status(400).json({ error: 'Video exceeds maximum duration for your plan' });
      return;
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        userId: req.userId!,
        fileName: originalname,
        fileSize: size,
        mimeType: mimetype,
        storageUrl: path || filename,
        status: 'UPLOADING',
      },
    });

    // Trigger async processing
    // processVideo(video.id).catch(console.error);

    res.status(201).json({
      video,
      message: 'Video uploaded. Processing has started.',
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
}

function getPlanLimits(plan: string) {
  const limits: Record<string, { maxDuration: number }> = {
    FREE: { maxDuration: 15 },
    CREATOR: { maxDuration: 60 },
    PRO: { maxDuration: 180 },
    AGENCY: { maxDuration: 360 },
  };
  return limits[plan] || limits.FREE;
}

export async function getVideos(req: AuthRequest, res: Response): Promise<void> {
  try {
    const videos = await prisma.video.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { clips: true, exports: true },
        },
      },
    });

    res.json({ videos });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
}

export async function getVideo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const video = await prisma.video.findFirst({
      where: { id, userId: req.userId },
      include: {
        clips: { orderBy: { startTime: 'asc' } },
        exports: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    res.json({ video });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
}

export async function deleteVideo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const video = await prisma.video.findFirst({
      where: { id, userId: req.userId },
    });

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    // TODO: Delete from storage
    await prisma.video.delete({ where: { id } });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
}

export async function getClips(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { videoId } = req.params;

    const clips = await prisma.clip.findMany({
      where: {
        videoId,
        video: { userId: req.userId },
      },
      orderBy: { confidenceScore: 'desc' },
    });

    res.json({ clips });
  } catch (error) {
    console.error('Get clips error:', error);
    res.status(500).json({ error: 'Failed to fetch clips' });
  }
}

export async function createExport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { videoId, clipIds, platform, aspectRatio, settings } = req.body;

    // Check export limits
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const exportsCount = await prisma.export.count({
      where: {
        userId: req.userId,
        createdAt: { gte: currentMonth },
      },
    });

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId },
    });

    const planLimits = { FREE: 3, CREATOR: 50, PRO: 200, AGENCY: 999999 };
    const maxExports = planLimits[subscription?.plan as keyof typeof planLimits] || 3;

    if (exportsCount >= maxExports) {
      res.status(403).json({ error: 'Export limit reached for this month. Upgrade your plan.' });
      return;
    }

    const exportRecord = await prisma.export.create({
      data: {
        userId: req.userId!,
        videoId,
        clipIds: clipIds || [],
        platform,
        aspectRatio,
        settings: settings || {},
        status: 'PENDING',
        creditsCost: 1,
      },
    });

    // TODO: Queue export processing
    // processExport(exportRecord.id).catch(console.error);

    res.status(201).json({
      export: exportRecord,
      message: 'Export queued. You will be notified when ready.',
    });
  } catch (error) {
    console.error('Create export error:', error);
    res.status(500).json({ error: 'Failed to create export' });
  }
}

export async function getExports(req: AuthRequest, res: Response): Promise<void> {
  try {
    const exports = await prisma.export.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        video: {
          select: { id: true, fileName: true, duration: true },
        },
      },
    });

    res.json({ exports });
  } catch (error) {
    console.error('Get exports error:', error);
    res.status(500).json({ error: 'Failed to fetch exports' });
  }
}
