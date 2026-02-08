#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

def create_rounded_rectangle(draw, xy, radius, fill):
    """Draw a rounded rectangle"""
    x1, y1, x2, y2 = xy
    width = x2 - x1
    height = y2 - y1
    
    # Clamp radius to not exceed half the smallest dimension
    radius = min(radius, width // 2, height // 2)
    
    if radius <= 0:
        # Just draw a simple rectangle if radius is too small
        draw.rectangle([x1, y1, x2, y2], fill=fill)
        return
    
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
    draw.pieslice([x1, y1, x1 + radius * 2, y1 + radius * 2], 180, 270, fill=fill)
    draw.pieslice([x2 - radius * 2, y1, x2, y1 + radius * 2], 270, 360, fill=fill)
    draw.pieslice([x1, y2 - radius * 2, x1 + radius * 2, y2], 90, 180, fill=fill)
    draw.pieslice([x2 - radius * 2, y2 - radius * 2, x2, y2], 0, 90, fill=fill)

def create_icon(size):
    # Create image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    bg_color = (76, 175, 80, 255)  # #4CAF50
    bar_color = (255, 255, 255, 255)  # White
    
    # Background with rounded corners
    corner_radius = int(size * 0.1875)  # 24/128
    create_rounded_rectangle(draw, [0, 0, size, size], corner_radius, bg_color)
    
    # Scale factors
    scale = size / 128
    offset_x = int(24 * scale)
    offset_y = int(24 * scale)
    bar_width = int(8 * scale)
    bar_radius = max(1, int(2 * scale))
    
    # Bar positions
    bars = [
        {'x': 4, 'y': 48, 'height': 16},
        {'x': 20, 'y': 16, 'height': 48},
        {'x': 36, 'y': 36, 'height': 44},
        {'x': 52, 'y': 24, 'height': 56},
        {'x': 68, 'y': 52, 'height': 28}
    ]
    
    # Draw equalizer bars
    for bar in bars:
        x = offset_x + int(bar['x'] * scale)
        y = offset_y + int(bar['y'] * scale)
        h = int(bar['height'] * scale)
        
        # Draw rounded bar
        create_rounded_rectangle(draw, [x, y, x + bar_width, y + h], bar_radius, bar_color)
    
    return img

# Generate all sizes
sizes = [16, 32, 48, 128]
icon_dir = 'extension/icons'

for size in sizes:
    img = create_icon(size)
    img.save(f'{icon_dir}/icon{size}.png', 'PNG')
    print(f'Generated icon{size}.png')

print('All icons generated successfully!')
