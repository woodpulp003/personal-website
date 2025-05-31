import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [400, 400]; // width, height
const outputDir = join(process.cwd(), 'public', 'images');

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Generate 3 placeholder images with different colors
const colors = ['#1DB954', '#1ED760', '#1AA34A']; // Spotify-like greens

async function generatePlaceholders() {
  for (let i = 0; i < 3; i++) {
    const svg = `
      <svg width="${sizes[0]}" height="${sizes[1]}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${colors[i]}"/>
        <circle cx="50%" cy="50%" r="40%" fill="none" stroke="white" stroke-width="2"/>
        <circle cx="50%" cy="50%" r="10%" fill="white"/>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .resize(sizes[0], sizes[1])
      .toFile(join(outputDir, `vinyl-placeholder-${i + 1}.png`));
  }
}

generatePlaceholders().catch(console.error); 