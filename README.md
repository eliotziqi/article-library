# Article Library

Minimalist article management system.

## Features

- [x] Display articles (Markdown)
- [x] Frontmatter support (title, summary, author, created date)
- [x] Table rendering with GitHub Flavored Markdown
- [x] Syntax highlighting for code blocks
- [x] Edit this page on GitHub functionality
- [x] Built-in article editor/generator
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

### Getting Started

```bash
npm install
npm run dev
```

### Article Creation/Editing Workflow

#### Method 1: Using Built-in Editor (Recommended)

1. **Access the Editor**
   - Navigate to `/editor` in your browser
   - Or click "Open Editor" from the home page

2. **Create Article**
   - Fill in article metadata (title, author, date, summary)
   - Write content using Markdown syntax
   - Click "Generate Preview" to see the output
   - Use "Download .md" to save the file locally

3. **Deploy Article**
   - Place the downloaded `.md` file in `public/articles/`
   - Add a new route in `src/App.jsx`:
     ```jsx
     <Route 
       path="/articles/your-article"
       element={<ArticleView articlePath="articles/your-article.md" title="Your Title" />}
     />
     ```
   - Update navigation if needed
   - Build and deploy: `npm run build`

#### Method 2: Manual File Creation

1. **Create Markdown File**
   - Create `.md` file in `public/articles/`
   - Follow the frontmatter format:
     ```markdown
     ---
     title: Your Article Title
     summary: Brief description
     author: Your Name
     created: YYYY-MM-DD
     ---
     
     # Your content here
     ```

2. **Add Route**
   - Same as Method 1, step 3

#### Method 3: GitHub Direct Edit

1. **Use Edit Button**
   - Click "Edit this page on GitHub" on any article
   - Make changes directly in GitHub
   - Commit changes to update the live site

### Publishing Workflow

Articles are automatically published when:
- Files are added to `public/articles/`
- Routes are configured in `src/App.jsx`
- Changes are built with `npm run build`
- Built files in `docs/` are committed to repository

