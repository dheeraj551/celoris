# SOP: Adding New Blog Posts to Celoris

## 🎯 Objective
Integrate a new blog post from a Markdown file and an image into the Next.js app while maintaining a consistent UI/UX and bypassing database requirements for immediate deployment.

## 📥 Required Inputs
1. A `.md` file containing the blog content.
2. An image file added to the `/public` folder.

## 🛠 Execution Workflow

### Step 1: Content Extraction
- Read the `.md` file.
- Extract: **Title**, **Category**, and **Main Content**.
- Generate a **URL-friendly slug** (lowercase, hyphens instead of spaces).
- Create a concise **Excerpt** based on the introduction.

### Step 2: Implementation in `app/blog/[slug]/page.tsx`
- Add a hardcoded data block for the new slug to the `BlogPostPage` logic.
- **Fields to define:**
  - `id`: Unique identifier.
  - `title`: Full title of the post.
  - `slug`: The generated slug.
  - `excerpt`: The summarized version.
  - `featured_image_url`: Path to the image in `/public`.
  - `author_name`: Default to "Celoris Team".
  - `category`: Extracted category.
  - `reading_time`: Estimated minutes.
  - `published_at`: ISO date string.
  - `views_count`: Initial view count.
- Ensure content is passed through `marked.parse()`.

### Step 3: Implementation in `app/blog/page.tsx`
- Add the post entry to the `STATIC_POSTS` array.
- Ensure all fields match the individual page data.

### Step 4: Critical Technical Checks
- **Hydration:** Always use `timeZone: 'UTC'` in `toLocaleDateString` to prevent server-client mismatches.
- **Client Components:** Ensure `ShareButtons` uses a `mounted` state check before accessing `window.location`.
- **Build Safety:** Never create a `page.tsx` file containing raw Markdown; content must be inside a TS/JS string or data object.

## ✅ Verification Checklist
- [ ] Post is visible on the main `/blog` page.
- [ ] Post loads correctly at `/blog/[slug]`.
- [ ] Featured image displays correctly.
- [ ] No hydration errors in the browser console.
