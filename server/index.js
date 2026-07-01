import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import tryonRouter from './routes/tryon.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json({ limit: '12mb' }));
app.use(express.static(rootDir));
app.use('/api', tryonRouter);

app.listen(PORT, () => {
  console.log(`Mirror Fashion running at http://localhost:${PORT}`);
  const token = process.env.REPLICATE_API_TOKEN;
  if (token) {
    console.log('Replicate token loaded');
  } else {
    console.warn('Warning: REPLICATE_API_TOKEN is not set — try-on will fail until configured');
  }
});
