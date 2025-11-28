# Official Instagram Embed Structure Reference

## Instagram's Official Embed Template

This is the exact structure Instagram provides when you copy an embed from their platform:

```html
<blockquote class="instagram-media" 
            data-instgrm-captioned 
            data-instgrm-permalink="https://www.instagram.com/reel/[POST_ID]/?utm_source=ig_embed&amp;utm_campaign=loading" 
            data-instgrm-version="14" 
            style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
  <div style="padding:16px;"> 
    <a href="https://www.instagram.com/reel/[POST_ID]/?utm_source=ig_embed&amp;utm_campaign=loading" 
       style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" 
       target="_blank"> 
      <!-- Instagram generates complex interactive content here -->
    </a>
  </div>
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

## Key Elements

### 1. Required Attributes
- `data-instgrm-permalink`: The Instagram post URL
- `data-instgrm-version="14"`: Instagram embed API version
- `data-instgrm-captioned`: Shows captions when present

### 2. Required Styling
- `background:#FFF`: White background
- `border:0`: No border
- `border-radius:3px`: Subtle rounding
- `box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)`: Soft shadow
- `max-width:540px, min-width:326px`: Width constraints
- `width:calc(100% - 2px)`: Responsive width calculation

### 3. Required Script
- `//www.instagram.com/embed.js`: Official Instagram embed script
- Must be loaded asynchronously

## Implementation Notes

### In React/Next.js:
```jsx
<blockquote 
  className="instagram-media" 
  data-instgrm-permalink={instagramUrl}
  data-instgrm-version="14"
  data-instgrm-captioned="true"
  style={{ 
    background: '#fff', 
    border: '0', 
    borderRadius: '3px', 
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
    margin: '1px', 
    maxWidth: '540px', 
    minWidth: '326px', 
    padding: '0',
    width: 'calc(100% - 2px)'
  }}
/>
```

### Loading the Script:
```javascript
// Use protocol-relative URL for HTTP/HTTPS compatibility
const script = document.createElement('script');
script.src = '//www.instagram.com/embed.js';
script.async = true;
document.head.appendChild(script);
```

### Processing Embeds:
```javascript
// Process after script loads and DOM is ready
setTimeout(() => {
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  }
}, 100);
```

## CSS Considerations

### Do's:
- Let Instagram handle their own complex styling
- Only add minimal responsive adjustments
- Preserve the essential Instagram styling
- Use `max-width` and margin for responsive behavior

### Don'ts:
- Don't override Instagram's core styling
- Don't remove the required CSS properties
- Don't interfere with Instagram's z-index and positioning
- Don't change the basic Instagram structure

## Testing the Embed

After implementation, you should see:
1. **Video playback** directly in the embed (not redirecting)
2. **Interactive buttons** (like, comment, save)
3. **Swipe gestures** working on mobile
4. **Auto-play** when appropriate
5. **Full Instagram experience** within your platform

## Troubleshooting

If embeds don't work:
1. Check the `data-instgrm-permalink` URL is valid
2. Ensure the Instagram embed script is loaded
3. Verify `window.instgrm.Embeds.process()` is called
4. Check browser console for Instagram script errors
5. Ensure the blockquote structure matches exactly