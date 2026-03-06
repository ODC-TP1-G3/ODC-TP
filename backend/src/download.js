const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function hashIp(ip) {
  return crypto.createHash('sha256')
    .update(ip + (process.env.IP_SALT || 'salt'))
    .digest('hex');
}

async function getFileInfo(req, res) {
  const { slug } = req.params;
  try {
    const file = await prisma.file.findUnique({
      where: { slug, active: true },
      select: {
        slug: true, title: true, description: true, tags: true,
        originalName: true, mimeType: true, size: true, uploadedAt: true,
        _count: { select: { downloads: true } },
      },
    });
    if (!file) return res.status(404).json({ error: 'File not found' });
    return res.json({ ...file, downloadCount: file._count.downloads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function downloadFile(req, res) {
  const { slug } = req.params;
  try {
    const file = await prisma.file.findUnique({ where: { slug, active: true } });
    if (!file) return res.status(404).json({ error: 'File not found' });

    const filePath = path.resolve(file.storagePath);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ error: 'File missing from storage' });

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    await prisma.downloadLog.create({
      data: {
        fileId: file.id,
        ipHash: hashIp(ip),
        userAgent: req.headers['user-agent']?.slice(0, 255) || null,
      },
    });

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.size);
    return res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getFileInfo, downloadFile };