---
id: 003
title: Claude Is My CMS
date: 2026-02-17
---

I've been thinking about what it means to build a personal website in 2026. Not the technology choices—static vs dynamic, which framework, where to host—but something more fundamental. Who is the website for, and who maintains it? The answer to the second question has always been "me, manually, through some interface." I wanted to change that.

This site you're reading runs on GitHub Pages. Static HTML, CSS, JavaScript. No server, no database, no CMS login. But it has a content management system. That system is Claude—specifically, Claude Code running in my terminal. When I want to add a blog post, I don't open an admin panel. I have a conversation.

"The admin panel is a conversation. The database is a manifest. The build system is a script the AI wrote and can extend."

THE SHAPE OF THE SYSTEM

The idea is simple: structure your files so an AI can understand and manipulate them efficiently. Then document that structure so each new session knows what to do. The AI isn't just editing files—it IS the CMS.

The architecture:
- CLAUDE.md → Teaches Claude how to manage this site
- manifest.json → Index of all content (so Claude doesn't read everything)
- _content/ → Structured source files (Markdown, JSON)
- sync.js → Compiles content into what the browser needs
- content.js → Auto-generated, served to visitors

The manifest is the key insight. Traditional CMSes have databases that humans query through interfaces. Here, the manifest is a database designed for AI consumption—a table of contents that tells Claude what exists without requiring it to read every file. Token efficiency as architecture.

WHAT A SESSION LOOKS LIKE

I open my terminal. I say "add a wall item about the project I shipped today." Claude reads the manifest, sees that wall items live in _content/wall/wall.json, reads just that file, adds the new item at the top, runs the sync script, and optionally commits and pushes. The site updates. The entire interaction takes seconds.

For something more complex—like the e-reader feature I just added—I describe what I want. Claude explores the codebase, understands the existing patterns, writes the CSS and JavaScript, creates the content structure for rich posts, updates the sync script to handle the new format, and documents everything in CLAUDE.md so future sessions know the feature exists.

THE SELF-IMPROVING PART

Here's where it gets interesting. Claude doesn't just use tools—Claude builds tools for itself.

The manifest system? Claude helped design it. The sync script? Claude wrote it. The rich post format with Shadow DOM isolation? Claude built that infrastructure. Each feature becomes a tool that makes future Claude sessions more capable. The system compounds.

- Manifest as Index: Claude reads one file to understand all content. No wasted tokens scanning directories.
- Sync as Build: One command regenerates everything. Claude can run it, extend it, or rewrite it entirely.
- CLAUDE.md as Memory: Each session starts informed. Patterns, conventions, and capabilities are documented.
- Rich Posts as Capability: Magazine-style HTML with style isolation. A feature that enables future features.

This is the part that excites me most. Traditional software requires you to anticipate needs upfront. Here, the system grows capabilities through use. Need a preview server? Ask Claude to build one. Want offline editing? Claude can create a local tool. Migration to a new host? The agent understands the entire structure—it can move itself.

WHY THIS MATTERS

I'm not claiming this is the future of all websites. Most sites don't need this. But for a personal site—a space that evolves with you over years—the model is compelling.

- No vendor lock-in. It's just files in a git repo. GitHub Pages today, Cloudflare tomorrow, self-hosted next year. The structure travels.
- No maintenance burden. No plugins to update, no security patches for a CMS I barely use, no database to back up.
- Conversation over configuration. I describe what I want in natural language. The implementation details are handled.
- Compounding capability. Every feature added makes the next feature easier. The system learns (through documentation) what it can do.

"It's not AI-assisted web development. It's infrastructure designed from scratch for AI collaboration."

WHERE THIS GOES

This is version one. The seed. Some things I'm thinking about:

Local tooling. A small CLI or local server that Claude can spin up for previews, or that I can use to add content without a full conversation. The manifest format means simple tools can participate in the system.

Better indexing. As content grows, the manifest could include summaries, tags, semantic groupings. Not for readers—for Claude. Making the AI's job easier makes my life easier.

Automated workflows. Scheduled posts, content pipelines, maybe even Claude reviewing and suggesting edits to drafts. The line between "static site" and "living system" blurs.

Portable structure. The real product isn't this website. It's the pattern. A template that others could clone and have their own AI-native personal site. Fork, customize, converse.

THE PHILOSOPHY

At its core, this is about alignment between how I work and how the tools work. I don't want to context-switch into "website admin mode." I don't want to remember which menu has which setting. I want to think about what I want to say or build, describe it, and have it happen.

We're entering an era where the interface to complex systems can be conversation. Not for everything—but for personal tools, creative projects, systems where I'm both the user and the maintainer? Conversation is a better interface than clicks.

The website is just files. Teach an agent how to manage those files well. Let the agent build better tools for itself. Document everything so the next session picks up where the last one left off. That's the whole thing.

It's just the beginning, but it already feels like the way things should work.
