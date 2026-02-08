const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [16, 32, 48, 128];
const baseColor = '#4CAF50';
const barColor = '#FFFFFF';

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background with rounded corners
  const cornerRadius = size * 0.1875; // 24/128 = 0.1875
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.moveTo(cornerRadius, 0);
  ctx.lineTo(size - cornerRadius, 0);
  ctx.quadraticCurveTo(size, 0, size, cornerRadius);
  ctx.lineTo(size, size - cornerRadius);
  ctx.quadraticCurveTo(size, size, size - cornerRadius, size);
  ctx.lineTo(cornerRadius, size);
  ctx.quadraticCurveTo(0, size, 0, size - cornerRadius);
  ctx.lineTo(0, cornerRadius);
  ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
  ctx.closePath();
  ctx.fill();
  
  // Scale factors
  const scale = size / 128;
  const offsetX = 24 * scale;
  const offsetY = 24 * scale;
  const barWidth = 8 * scale;
  const barRadius = 2 * scale;
  
  // Draw equalizer bars
  ctx.fillStyle = barColor;
  
  // Bar positions (scaled)
  const bars = [
    { x: 4, y: 48, height: 16 },
    { x: 20, y: 16, height: 48 },
    { x: 36, y: 36, height: 44 },
    { x: 52, y: 24, height: 56 },
    { x: 68, y: 52, height: 28 }
  ];
  
  bars.forEach(bar => {
    const x = offsetX + (bar.x * scale);
    const y = offsetY + (bar.y * scale);
    const h = bar.height * scale;
    
    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x + barRadius, y);
    ctx.lineTo(x + barWidth - barRadius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + barRadius);
    ctx.lineTo(x + barWidth, y + h - barRadius);
    ctx.quadraticCurveTo(x + barWidth, y + h, x + barWidth - barRadius, y + h);
    ctx.lineTo(x + barRadius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - barRadius);
    ctx.lineTo(x, y + barRadius);
    ctx.quadraticCurveTo(x, y, x + barRadius, y);
    ctx.closePath();
    ctx.fill();
  });
  
  return canvas;
}

// Generate all sizes
sizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`extension/icons/icon${size}.png`, buffer);
  console.log(`Generated icon${size}.png`);
});

console.log('All icons generated successfully!');
