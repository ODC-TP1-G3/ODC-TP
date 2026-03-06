const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, login, logout, me } = require('./auth');
const { getFileInfo, downloadFile } = require('./download');

const router = express.Router();
const prisma = new PrismaClient();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = (process.env.ALLOWED_MIME || '').split(',').filter(Boolean);
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '50') * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_, file, cb) => {
    if (ALLOWED_MIME.length && !ALLOWED_MIME.includes(file.mimetype))
      return cb(new Error(`MIME type not allowed: ${file.mimetype}`));
    cb(null, true);
  },
});

// Auth
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', me);

// Public
router.get('/f/:slug', getFileInfo);
router.get('/f/:slug/download', downloadFile);

// Admin — Files
router.get('/admin/files', requireAuth, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      orderBy: { uploadedAt: 'desc' },
      include: { _count: { select: { downloads: true } } },
    });
    res.json(files.map(f => ({
      id: f.id, slug: f.slug, title: f.title, description: f.description,
      tags: f.tags, originalName: f.originalName, mimeType: f.mimeType,
      size: f.size, active: f.active, uploadedAt: f.uploadedAt,
      updatedAt: f.updatedAt, downloadCount: f._count.downloads,
    })));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/admin/files', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { title, description, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    const slug = uuidv4().replace(/-/g, '').slice(0, 12);
    const file = await prisma.file.create({
      data: {
        slug, title,
        description: description || null,
        tags: tags || null,
        originalName: req.file.originalname,
        storagePath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
    res.status(201).json(file);
  } catch (err) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/admin/files/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, tags, active } = req.body;
  try {
    const file = await prisma.file.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags }),
        ...(active !== undefined && { active }),
      },
    });
    res.json(file);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'File not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/files/:id/replace', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const id = parseInt(req.params.id);
  try {
    const old = await prisma.file.findUnique({ where: { id } });
    if (!old) return res.status(404).json({ error: 'File not found' });
    const updated = await prisma.file.update({
      where: { id },
      data: {
        originalName: req.file.originalname,
        storagePath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
    if (fs.existsSync(old.storagePath)) fs.unlink(old.storagePath, () => {});
    res.json(updated);
  } catch (err) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/admin/files/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: 'File not found' });
    await prisma.file.delete({ where: { id } });
    if (fs.existsSync(file.storagePath)) fs.unlink(file.storagePath, () => {});
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/admin/files/:id/qrcode', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: 'File not found' });
 HEAD
    const publicUrl = `${process.env.PUBLIC_URL }/f/${file.slug}`;

    const publicUrl = `${process.env.PUBLIC_URL || 'http://localhost:3000'}/f/${file.slug}`;
 tp-devops
    const qr = await QRCode.toDataURL(publicUrl, { width: 300, margin: 2 });
    res.json({ qr, publicUrl });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Admin — Stats
router.get('/admin/stats', requireAuth, async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);
    const where = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    const totalDownloads = await prisma.downloadLog.count({ where });
    const perFile = await prisma.file.findMany({
      select: {
        id: true, slug: true, title: true,
        _count: { select: { downloads: Object.keys(where).length ? { where } : true } },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({
      totalDownloads,
      perFile: perFile.map(f => ({
        id: f.id, slug: f.slug, title: f.title, downloads: f._count.downloads,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large' });
  if (err.message?.startsWith('MIME type not allowed')) return res.status(415).json({ error: err.message });
  next(err);
});

module.exports = router;