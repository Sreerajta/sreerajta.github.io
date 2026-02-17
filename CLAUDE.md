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
- **Blog** - Blog posts (3 per page)
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
│   │   └── 001-first-post.md  ← Individual blog posts
│   └── wall/
│       └── wall.json     ← Wall items
├── content.js            ← AUTO-GENERATED (don't edit directly)
├── index.html            ← HTML structure
├── styles.css            ← Styling
├── script.js             ← Navigation/rendering logic
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

### Step 2: Read Only What You Need

| Task | Files to Read |
|------|---------------|
| Edit site name/bio | `_content/site.json` |
| Edit projects | `_content/projects.json` |
| Edit specific blog post | `_content/posts/{id}-{slug}.md` |
| Add new blog post | Create new file + update manifest |
| Edit wall items | `_content/wall/wall.json` |

### Step 3: Sync After Changes
```bash
node _claude/sync.js
```
This regenerates `content.js` from source files.

---

## Content File Formats

### Blog Post (`_content/posts/*.md`)
```markdown
---
id: 002
title: My Post Title
date: 2026-02-17
---

Post content here. Supports multi-line text.
Can include **markdown** formatting in content.
```

**Naming convention:** `{id}-{slug}.md` (e.g., `002-my-post-title.md`)

### Wall Item (`_content/wall/wall.json`)
```json
[
  {
    "id": "002",
    "date": "2026-02-17",
    "text": "Short thought or update"
  },
  {
    "id": "001",
    "date": "2026-01-08",
    "text": "Previous item..."
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

### Add a New Blog Post

1. **Get next ID** from manifest (current count + 1, zero-padded to 3 digits)
2. **Create file:** `_content/posts/{id}-{slug}.md`
3. **Update manifest:** Add entry to `blog.posts` array (at TOP):
   ```json
   {
     "id": "002",
     "slug": "new-post",
     "title": "New Post Title",
     "date": "2026-02-17",
     "file": "_content/posts/002-new-post.md"
   }
   ```
4. **Run sync:** `node _claude/sync.js`

### Add a Wall Item

1. **Edit** `_content/wall/wall.json`
2. **Add new item at TOP** with incremented ID
3. **Run sync:** `node _claude/sync.js`

### Edit Existing Content

1. **Read manifest** to find the file path
2. **Edit the specific file**
3. **Run sync:** `node _claude/sync.js`

---

## Deployment

1. Make changes to `_content/` files
2. Run `node _claude/sync.js`
3. Commit and push to `main` branch
4. GitHub Pages auto-deploys

---

## Design Reference

- **Background:** `#f5e6d3` (warm cream)
- **Text:** `#000` (black)
- **Font:** Courier New (monospace)
- **Max-width:** 900px
- **Mobile breakpoint:** 640px

---

## Important Notes

- **Never edit `content.js` directly** - it's auto-generated
- **Dates:** Use `YYYY-MM-DD` format
- **IDs:** Zero-padded 3 digits (001, 002, 003...)
- **Order:** Newest items at TOP of arrays
- **Sync:** Always run sync.js after content changes
