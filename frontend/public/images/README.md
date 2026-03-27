# Image Folder Structure

Place your images in the appropriate folders:

## Folders

### `/team`
Team group photos, team banners
- Example: `team-2026.jpg`, `team-banner.jpg`

### `/coaches`
Individual coach headshots
- Example: `reynolds.jpg`, `martinez.jpg`, `brooks.jpg`

### `/athletes/high-school`
High school athlete photos
- Example: `marcus-johnson.jpg`, `sarah-mitchell.jpg`

### `/athletes/middle-school`
Middle school athlete photos
- Example: `ethan-harris.jpg`, `sophia-clark.jpg`

### `/meets`
Photos from meets and events
- Example: `state-championship-2025.jpg`, `greyhound-classic.jpg`

### `/general`
Logo, hero images, backgrounds, misc
- Example: `logo.png`, `hero-background.jpg`, `track.jpg`

## Usage in Code

Reference images with absolute paths from the public folder:

```jsx
<img src="/images/coaches/reynolds.jpg" alt="Coach Reynolds" />
<img src="/images/team/team-2026.jpg" alt="2026 Team Photo" />
```

## Recommended Image Sizes

- Hero/Banner: 1920x1080px
- Coach headshots: 400x400px (square)
- Athlete photos: 300x300px (square)
- Team photos: 1200x800px
- Meet photos: 1200x800px
