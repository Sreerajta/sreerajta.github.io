#!/usr/bin/env node

/**
 * Claude CMS Sync Script
 * Regenerates content.js from the indexed _content/ files
 *
 * Usage: node _claude/sync.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, '_content');
const MANIFEST_PATH = path.join(ROOT, '_claude', 'manifest.json');
const OUTPUT_PATH = path.join(ROOT, 'content.js');

// Read and parse JSON file
function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Parse markdown file with frontmatter
function parseMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const parts = content.split('---');

    if (parts.length < 3) {
        throw new Error(`Invalid markdown format in ${filePath}`);
    }

    // Parse frontmatter
    const frontmatter = {};
    parts[1].trim().split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            frontmatter[key.trim()] = valueParts.join(':').trim();
        }
    });

    // Get content (everything after second ---)
    const body = parts.slice(2).join('---').trim();

    return { ...frontmatter, content: body };
}

// Escape string for JavaScript
function escapeJS(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');
}

function sync() {
    console.log('🔄 Syncing content...\n');

    // Load manifest
    const manifest = readJSON(MANIFEST_PATH);

    // Load site config
    const siteConfig = readJSON(path.join(ROOT, manifest.site.configFile));
    console.log('✓ Site config loaded');

    // Load projects
    const projects = readJSON(path.join(ROOT, manifest.projects.file));
    console.log(`✓ ${projects.length} projects loaded`);

    // Load blog posts from individual files
    const blogPosts = manifest.blog.posts.map(postMeta => {
        const postData = parseMarkdown(path.join(ROOT, postMeta.file));
        return {
            date: postData.date,
            title: postData.title,
            content: postData.content
        };
    });
    console.log(`✓ ${blogPosts.length} blog posts loaded`);

    // Load wall items
    const wallItems = readJSON(path.join(ROOT, manifest.wall.file));
    console.log(`✓ ${wallItems.length} wall items loaded`);

    // Generate content.js
    const output = `var SITE_CONFIG = {
    name: "${siteConfig.name}",
    bio: \`${escapeJS(siteConfig.bio)}\`,
    itemsPerPage: {
        blog: ${siteConfig.itemsPerPage.blog},
        wall: ${siteConfig.itemsPerPage.wall}
    }
};

// ========================================
// PROJECTS - Auto-generated from _content/projects.json
// ========================================
var PROJECTS = ${JSON.stringify(projects, null, 4)};

// ========================================
// BLOG POSTS - Auto-generated from _content/posts/*.md
// ========================================
var BLOG_POSTS = ${JSON.stringify(blogPosts, null, 4)};

// ========================================
// WALL ITEMS - Auto-generated from _content/wall/wall.json
// ========================================
var WALL_ITEMS = ${JSON.stringify(wallItems.map(w => ({ date: w.date, text: w.text })), null, 4)};
`;

    fs.writeFileSync(OUTPUT_PATH, output);
    console.log('\n✅ content.js regenerated successfully!');

    // Update manifest lastUpdated
    manifest.lastUpdated = new Date().toISOString().split('T')[0];
    manifest.blog.count = blogPosts.length;
    manifest.wall.count = wallItems.length;
    manifest.projects.count = projects.length;
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log('✅ manifest.json updated');
}

// Run
try {
    sync();
} catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
}
