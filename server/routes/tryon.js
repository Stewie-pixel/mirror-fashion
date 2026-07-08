import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Replicate from 'replicate';
import { byId } from '../../js/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');

const router = Router();

function fitTag(score) {
  if (score >= 92) return 'Excellent match';
  if (score >= 85) return 'Great match';
  return 'Good match';
}

function computeFitScore(product, aspectRatio) {
  let bonus = 0;
  if (aspectRatio >= 1.25) bonus += 20;
  else if (aspectRatio >= 1.0) bonus += 10;
  else bonus += 5;

  const base = Math.max(60, product.match - 25);
  return Math.min(product.match, base + bonus);
}

function parseAspectRatio(dataUrl) {
  const match = /^data:image\/\w+;base64,(.+)$/.exec(dataUrl);
  if (!match) return 1.33;
  const buf = Buffer.from(match[1], 'base64');
  if (buf.length < 24) return 1.33;
  // PNG IHDR width/height at bytes 16–23
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    if (w && h) return h / w;
  }
  // JPEG SOF scan — rough fallback
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 8) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8) {
        const h = buf.readUInt16BE(i + 5);
        const w = buf.readUInt16BE(i + 7);
        if (w && h) return h / w;
      }
      i += 2 + len;
    }
  }
  return 1.33;
}

function needsCrop(aspectRatio) {
  const target = 4 / 3;
  return Math.abs(aspectRatio - target) > 0.08;
}

async function urlToDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch result image (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get('content-type') || 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function resolveOutputUrl(output) {
  if (!output) return null;
  if (typeof output === 'string') return output;
  if (Array.isArray(output)) return resolveOutputUrl(output[0]);
  if (typeof output.url === 'function') return output.url();
  if (typeof output.url === 'string') return output.url;
  return null;
}

function garmentToDataUrl(imagePath) {
  const garmentPath = path.join(rootDir, imagePath.replace(/^\//, ''));
  if (!fs.existsSync(garmentPath)) {
    throw new Error(`Garment image not found: ${imagePath}`);
  }
  const ext = path.extname(garmentPath).slice(1).toLowerCase() || 'png';
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  const data = fs.readFileSync(garmentPath).toString('base64');
  return `data:image/${mime};base64,${data}`;
}

router.post('/try-on', async (req, res) => {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return res.status(503).json({ error: 'REPLICATE_API_TOKEN is not configured' });
  }

  const { userPhoto, productId } = req.body ?? {};
  if (!userPhoto || typeof userPhoto !== 'string') {
    return res.status(400).json({ error: 'userPhoto is required' });
  }
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'productId is required' });
  }

  const product = byId(productId);
  if (!product?.image) {
    return res.status(404).json({ error: 'Product not found or try-on unavailable' });
  }

  const aspectRatio = parseAspectRatio(userPhoto);
  let garmentDataUrl;
  try {
    garmentDataUrl = garmentToDataUrl(product.image);
  } catch (err) {
    return res.status(404).json({ error: err.message || 'Garment image not found' });
  }

  try {
    const replicate = new Replicate({ auth: token });
    const output = await replicate.run(
      "black-forest-labs/flux-2-pro",
      {
        input: {
          prompt: [
  "This is a virtual try-on task with two reference images.",
  "IMAGE 1 is the GARMENT REFERENCE — use it only to see the clothing item: its color, pattern, cut, fabric texture, and silhouette.",
  "IMAGE 2 is the PERSON — this is a real photo of a specific individual whose identity must be fully preserved in the output.",
  "",
  "Generate a photo of the person from IMAGE 2 wearing the garment from IMAGE 1.",
  "",
  "You MUST preserve exactly, from IMAGE 2:",
  "- Facial identity: face shape, eyes, nose, mouth, skin tone, facial hair, expression",
  "- Hair: style, length, color",
  "- Body: proportions, height, build, pose, stance",
  "- Setting: background, lighting direction, camera angle",
  "",
  "You MUST change only:",
  "- The clothing on their body, replaced with the garment from IMAGE 1",
  "",
  "The output must look like the same person from IMAGE 2, recognizable as the same individual, simply wearing different clothes. Do not use the face, body, or identity of anyone shown in IMAGE 1 — that image is a clothing reference only, not a person to depict.",
].join("\n"),
          resolution: "1 MP",
          aspect_ratio: "match_input_image",
          input_images: [garmentDataUrl, userPhoto],
          output_format: "webp",
          output_quality: 80,
          safety_tolerance: 2
        }
      }
    );

    const outputUrl = resolveOutputUrl(output);
    if (!outputUrl) {
      return res.status(502).json({ error: 'Replicate returned no output image' });
    }

    const compositeDataUrl = await urlToDataUrl(outputUrl);
    const fitScore = computeFitScore(product, aspectRatio);

    res.json({
      compositeDataUrl,
      fitScore,
      fitTag: fitTag(fitScore),
      signals: { apiGenerated: true },
    });
  } catch (err) {
    console.error('Try-on error:', err);
    if (err.message?.includes('401')) {
      return res.status(502).json({
        error: 'Replicate authentication failed — check REPLICATE_API_TOKEN in .env and restart the server',
      });
    }
    res.status(502).json({ error: err.message || 'Try-on generation failed' });
  }
});

export default router;
