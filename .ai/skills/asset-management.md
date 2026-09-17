# Asset Management Skill

## Purpose
Manage the image asset pipeline for StayGallery property photos.

## Asset Inventory
All assets are defined in: `scripts/download-assets.js`
All metadata is maintained in: `client/src/data/propertyData.js`
Downloaded files live in: `client/public/images/`

## Downloading Assets
```bash
# From project root
node scripts/download-assets.js
```

The script will:
- Skip already-downloaded files
- Validate HTTP 200 responses
- Verify minimum file size (>1KB)
- Generate manifest.json
- Report failed downloads

## Adding New Assets
1. Add entry to `ASSETS` array in `scripts/download-assets.js`:
```javascript
{
  id: 'unique-id',
  url: 'https://source.url/image.jpg',
  filename: 'gallery/category-N.jpg',
  alt: 'Descriptive alt text',
  category: 'Living room', // Must match GALLERY_IMAGES categories
  room: 'Living room',
  order: 20, // Next sequential order
  thumbnail: 'gallery/category-N-thumb.jpg',
  thumbUrl: 'https://source.url/image.jpg?w=400&h=300&fit=crop',
}
```

2. Add matching entry to `GALLERY_IMAGES` in `client/src/data/propertyData.js`:
```javascript
{
  id: 'unique-id',
  src: '/images/gallery/category-N.jpg',
  thumbnail: '/images/gallery/category-N-thumb.jpg',
  alt: 'Descriptive alt text',
  room: 'Living room',
  category: 'Living room',
  order: 20,
}
```

3. Re-run download script

## Replacing an Asset
1. Delete old file from `client/public/images/`
2. Update URL in `scripts/download-assets.js`
3. Re-run download script

## Fallback Strategy
- If any image fails to load, CSS `background-color: var(--color-bg-tertiary)` shows as placeholder
- Error boundary catches broken images
- No blank/broken image icons visible to users

## Asset Optimization (Production)
For production deployment:
```bash
# Optimize images with Sharp (install separately)
npm install -g sharp-cli

# Batch convert to WebP
find client/public/images -name "*.jpg" -exec \
  sharp {} --format webp --quality 85 -o {}.webp \;
```
