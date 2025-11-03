# Article Library

Minimalist article management system.

## Features

- [x] Display articles (Markdown)
- [x] Frontmatter support (title, summary, author, created date)
- [x] Table rendering with GitHub Flavored Markdown
- [x] Syntax highlighting for code blocks
- [x] Edit this page on GitHub functionality
- [ ] Fuzzy search
- [ ] Add/Edit via GitHub commits
- [ ] Article list with basic filtering

## Article Format

Articles should be written in Markdown with YAML frontmatter:

```markdown
---
title: Article Title
summary: Brief description of the article content
author: Author Name
created: YYYY-MM-DD  # Date in local timezone (e.g., 2025-11-03)
---

# Article Content

Your markdown content here...
```

## Dev

Articles will be stored as Markdown files in the repository.
Add/modify by committing `.md` files to the repo.

```bash
npm install
npm run dev
```

