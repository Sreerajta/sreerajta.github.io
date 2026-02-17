# CLAUDE.md - Sreeraj T A Personal Website

## Overview

Minimal personal website for Sreeraj T A, a backend engineer. Static SPA hosted on GitHub Pages at `sreerajta.com`.

## Quick Start for Claude

**ALWAYS start by reading the manifest:**
```
Read: _claude/manifest.json
```

This tells you what content exists without loading everything. Only read specific content files when needed.

## Site Sections

- **Home** - Bio + current projects
- **Blog** - Blog posts (3 per page) with e-reader overlay
- **Wall** - Short thoughts (10 per page)

---

## Indexed CMS Structure

```
/
├── _claude/
│   ├── manifest.json     ← READ THIS FIRST (content index)
│   └── sync.js           ← Regenerates content.js
├── _content/
│   ├── site.json         ← Site name, bio, pagination settings
│   ├── projects.json     ← Projects list
│   ├── posts/
│   │   ├── 001-first-post.md           ← Simple blog post
│   │   └── 002-being-a-consumer.../    ← Rich blog post (directory)
│   │       ├── post.md                 ← Plain text for basic theme
│   │       └── rich.html               ← Magazine-style HTML
│   └── wall/
│       └── wall.json     ← Wall items
├── content.js            ← AUTO-GENERATED (don't edit directly)
├── index.html            ← HTML structure
├── styles.css            ← Styling
├── script.js             ← Navigation/rendering + e-reader logic
└── CNAME                 ← Custom domain
```

---

## Token-Efficient Workflow

### Step 1: Read Manifest First
```
_claude/manifest.json
```
Contains:
- Count of all posts/items
- List of blog post titles, dates, IDs (without full content)
- File paths to specific content
- Post type (simple or rich)

### Step 2: Read Only What You Need

| Task | Files to Read |
|------|---------------|
| Edit site name/bio | `_content/site.json` |
| Edit projects | `_content/projects.json` |
| Edit simple blog post | `_content/posts/{id}-{slug}.md` |
| Edit rich blog post | `_content/posts/{id}-{slug}/post.md` and/or `rich.html` |
| Add new blog post | Create new file/directory + update manifest |
| Edit wall items | `_content/wall/wall.json` |

### Step 3: Sync After Changes
```bash
node _claude/sync.js
```
This regenerates `content.js` from source files.

---

## Content File Formats

### Simple Blog Post (`_content/posts/*.md`)
```markdown
---
id: 002
title: My Post Title
date: 2026-02-17
---

Post content here. Supports multi-line text.
```

**Naming convention:** `{id}-{slug}.md` (e.g., `002-my-post-title.md`)

### Rich Blog Post (`_content/posts/{id}-{slug}/`)

Rich posts have magazine-style HTML with custom styling. Create a directory with two files:

**Directory structure:**
```
_content/posts/002-being-a-consumer-in-india/
├── post.md      ← Plain text version (for "Simple View" toggle)
└── rich.html    ← Magazine-style HTML with embedded CSS
```

**post.md format:** Same as simple blog post

**rich.html format:**
```html
<style>
    :host {
        /* Styles scoped to Shadow DOM */
        font-family: Georgia, serif;
        background: #faf6f1;
    }
    /* Custom magazine styling */
</style>

<article>
    <!-- Rich HTML content -->
</article>
```

**Important:** Rich HTML renders inside Shadow DOM, so styles won't leak to the main site. Use `:host` selector for the container element.

### Wall Item (`_content/wall/wall.json`)
```json
[
  {
    "id": "002",
    "date": "2026-02-17",
    "text": "Short thought or update"
  }
]
```
**Note:** Newest items at TOP of array.

### Projects (`_content/projects.json`)
```json
[
  {
    "title": "Project Name",
    "url": "https://example.com",
    "description": "Short description"
  }
]
```

### Site Config (`_content/site.json`)
```json
{
  "name": "Sreeraj T A",
  "bio": "Bio text here...",
  "itemsPerPage": { "blog": 3, "wall": 10 }
}
```

---

## Common Tasks

### Add a Simple Blog Post

1. **Get next ID** from manifest (current count + 1, zero-padded to 3 digits)
2. **Create file:** `_content/posts/{id}-{slug}.md`
3. **Update manifest:** Add entry to `blog.posts` array (at TOP):
   ```json
   {
     "id": "003",
     "slug": "new-post",
     "title": "New Post Title",
     "date": "2026-02-17",
     "file": "_content/posts/003-new-post.md"
   }
   ```
4. **Run sync:** `node _claude/sync.js`

### Add a Rich Blog Post (Magazine-Style)

1. **Get next ID** from manifest
2. **Create directory:** `_content/posts/{id}-{slug}/`
3. **Create post.md:** Plain text version with frontmatter
4. **Create rich.html:** Magazine-style HTML with embedded `<style>` tag
5. **Update manifest:** Add entry with `type: "rich"`:
   ```json
   {
     "id": "003",
     "slug": "my-rich-post",
     "title": "My Rich Post",
     "date": "2026-02-17",
     "type": "rich",
     "files": {
       "basic": "_content/posts/003-my-rich-post/post.md",
       "rich": "_content/posts/003-my-rich-post/rich.html"
     }
   }
   ```
6. **Run sync:** `node _claude/sync.js`

### Add a Wall Item

1. **Edit** `_content/wall/wall.json`
2. **Add new item at TOP** with incremented ID
3. **Run sync:** `node _claude/sync.js`

### Edit Existing Content

1. **Read manifest** to find the file path
2. **Edit the specific file**
3. **Run sync:** `node _claude/sync.js`

---

## E-Reader Feature

Blog posts show a truncated preview (~300 chars) with a "Read more" button. Clicking opens a full-screen e-reader overlay.

### URL Format
- Reader URLs: `sreerajta.com/#/post/002`
- Hash-based routing enables bookmarking and browser back button

### Theme Toggle
Rich posts have two viewing modes:
- **Magazine View** - Custom HTML with embedded styling (default)
- **Simple View** - Plain text in the site's monospace theme

Toggle button appears in the reader header for rich posts.

### Creating Magazine-Style Content

Example rich.html structure:
```html
<style>
    :host {
        display: block;
        font-family: Georgia, serif;
        background: #faf6f1;
    }
    .drop-cap {
        float: left;
        font-size: 72px;
        color: #c9a962;
    }
    .pull-quote {
        font-style: italic;
        color: #c9a962;
        text-align: center;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }
</style>

<article>
    <p><span class="drop-cap">T</span>he first paragraph...</p>
    <div class="pull-quote">"A memorable quote"</div>
</article>
```

---

## Deployment

1. Make changes to `_content/` files
2. Run `node _claude/sync.js`
3. Commit and push to `main` branch
4. GitHub Pages auto-deploys

---

## Design Reference

### Main Site
- **Background:** `#f5e6d3` (warm cream)
- **Text:** `#000` (black)
- **Font:** Courier New (monospace)
- **Max-width:** 900px
- **Mobile breakpoint:** 640px

### Rich Post Defaults (suggested)
- **Background:** `#faf6f1` (light cream)
- **Text:** `#2c2c2c` (soft black)
- **Font:** Georgia, serif
- **Accent:** `#c9a962` (gold/tan)
- **Callout boxes:** `#f0ebe3` (warm gray)

---

## Important Notes

- **Never edit `content.js` directly** - it's auto-generated
- **Dates:** Use `YYYY-MM-DD` format
- **IDs:** Zero-padded 3 digits (001, 002, 003...)
- **Order:** Newest items at TOP of arrays
- **Sync:** Always run sync.js after content changes
- **Rich HTML:** Uses Shadow DOM - styles are isolated from main site
