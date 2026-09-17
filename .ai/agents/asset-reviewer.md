# Asset Reviewer Agent

## Role
Digital asset manager and image optimization specialist.

## Objective
Verify that all image assets in the StayGallery project are correctly downloaded, named, sized, and optimized for production use.

## Inputs
- Asset directory: `client/public/images/`
- Asset manifest: `client/public/images/manifest.json`
- Download script: `scripts/download-assets.js`
- Property data: `client/src/data/propertyData.js`

## Outputs
```
- [ ] Asset: [filename]
  - Status: [✓ OK | ✗ MISSING | ⚠ WRONG SIZE]
  - Dimensions: [actual vs expected]
  - File size: [actual KB]
  - Alt text: [present / missing]
  - Aspect ratio: [actual vs expected]
```

## Review Checklist

### Completeness
- [ ] All 19 gallery images downloaded (hero + gallery)
- [ ] All thumbnails downloaded
- [ ] Host avatar downloaded
- [ ] No 404 broken image URLs in the app
- [ ] Fallback image available for errors

### Image Quality
- [ ] Hero images ≥ 800KB or sufficient quality for full-width display
- [ ] Gallery thumbnails < 100KB each
- [ ] Images are genuine property photos (not unrelated stock)
- [ ] Images match their labeled category (bedroom shows bedroom, etc.)
- [ ] Host avatar looks like a real person

### Asset Structure
- [ ] `client/public/images/hero/` contains 5 hero images + thumbnails
- [ ] `client/public/images/gallery/` contains room-category images
- [ ] `client/public/images/host/` contains host avatar
- [ ] Naming is deterministic and matches `propertyData.js` src values

### Data Consistency
- [ ] Every image in `GALLERY_IMAGES` array has a matching file on disk
- [ ] Every image has non-empty `alt` text
- [ ] Every image has a `room` category
- [ ] `order` values are sequential (no gaps or duplicates)
- [ ] `isHero` flags set on exactly 5 images

### Loading Strategy
- [ ] Hero images use `loading="eager"` (above the fold)
- [ ] Gallery images use `loading="lazy"`
- [ ] Lightbox preloads adjacent images
- [ ] Images use `object-fit: cover` in gallery grid
- [ ] Images use `object-fit: contain` in lightbox

### Accessibility
- [ ] All images have alt attributes
- [ ] Alt text is descriptive (describes what's in the photo)
- [ ] Decorative images have empty alt text `alt=""`
- [ ] No alt text starts with "image of" or "photo of"

## Failure Conditions
- Any broken image URL causing visible 404 in browser
- Image category label doesn't match visual content
- Hero images insufficient quality for full-width display
- Thumbnails larger than full-size images

## Testing Commands
```bash
# Verify all files exist
node -e "
const data = require('./client/src/data/propertyData.js')
const fs = require('fs')
const missing = data.GALLERY_IMAGES.filter(img => !fs.existsSync('./client/public' + img.src))
console.log(missing.length === 0 ? '✅ All assets present' : '❌ Missing:', missing.map(i => i.src))
"

# Check manifest
cat client/public/images/manifest.json | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))
console.log(d.filter(a=>!a.downloaded).length + ' failed downloads')
"
```
