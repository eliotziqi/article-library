import { useEffect, useState } from 'react'
import { Alert, Spinner, Button } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './ArticleView.css'

// Manual frontmatter parsing function
function parseFrontmatter(content) {
  // Handle both CRLF and LF line endings
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }
  
  const [, frontmatterString, bodyContent] = match
  const data = {}
  
  // Simple YAML frontmatter parsing
  frontmatterString.split(/[\r\n]+/).forEach(line => {
    const trimmed = line.trim()
    if (trimmed && trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':')
      const value = valueParts.join(':').trim()
      // Remove quotes
      data[key.trim()] = value.replace(/^["']|["']$/g, '')
    }
  })
  
  return { data, content: bodyContent }
}

function resolveArticleUrl(articlePath) {
  if (!articlePath) {
    return articlePath
  }

  const absolutePattern = /^([a-z]+:)?\/\//i
  if (absolutePattern.test(articlePath)) {
    return articlePath
  }

  const normalizedBase = import.meta.env.BASE_URL.replace(/\/?$/, '')
  const normalizedPath = articlePath.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

function generateGitHubEditUrl(articlePath) {
  if (!articlePath) return null
  
  // GitHub repository information
  const owner = 'eliotziqi'
  const repo = 'article-library'
  const branch = 'main'
  
  // Convert article path to GitHub file path
  // Remove leading slash and normalize path
  const filePath = articlePath.replace(/^\/+/, '')
  
  return `https://github.com/${owner}/${repo}/edit/${branch}/public/${filePath}`
}

function formatDate(dateString) {
  if (!dateString) return ''
  
  // Parse date as local date to avoid timezone issues
  const dateParts = dateString.split('-')
  const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function ArticleView({ articlePath, title }) {
  const [content, setContent] = useState('')
  const [frontmatter, setFrontmatter] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadArticle() {
      setLoading(true)
      setError(null)

      try {
        const resolvedArticleUrl = resolveArticleUrl(articlePath)
        const response = await fetch(resolvedArticleUrl)
        if (!response.ok) {
          throw new Error(`Failed to load article (status ${response.status})`)
        }

        const text = await response.text()
        if (!cancelled) {
          // Parse frontmatter using custom function
          const parsed = parseFrontmatter(text)
          setContent(parsed.content)
          setFrontmatter(parsed.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setContent('')
          setFrontmatter({})
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadArticle()

    return () => {
      cancelled = true
    }
  }, [articlePath])

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status" aria-live="polite" aria-label="Loading article" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="article-alert">
        <Alert.Heading>Unable to display the article</Alert.Heading>
        <p className="mb-0">{error}</p>
      </Alert>
    )
  }

  return (
    <article className="article-view">
      {/* Use title from frontmatter, fallback to passed title prop */}
      {(frontmatter.title || title) && (
        <h1 className="article-title">{frontmatter.title || title}</h1>
      )}
      
      {/* Display article summary if available */}
      {frontmatter.summary && (
        <p className="article-summary">{frontmatter.summary}</p>
      )}
      
      {/* Display article metadata */}
      {(frontmatter.author || frontmatter.created) && (
        <div className="article-meta">
          {frontmatter.author && (
            <span className="article-author">
              <i className="bi bi-person-fill me-1"></i>
              By {frontmatter.author}
            </span>
          )}
          {frontmatter.created && (
            <span className="article-date">
              <i className="bi bi-calendar3 me-1"></i>
              {formatDate(frontmatter.created)}
            </span>
          )}
        </div>
      )}
      
      {/* Render only content body, excluding frontmatter */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
      
      {/* Edit this page link */}
      {articlePath && (
        <div className="article-edit-section">
          <hr className="article-divider" />
          <Button
            variant="outline-secondary"
            size="sm"
            href={generateGitHubEditUrl(articlePath)}
            target="_blank"
            rel="noopener noreferrer"
            className="article-edit-button"
            title="Edit this article on GitHub"
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit this page on GitHub
          </Button>
          <p className="article-edit-hint">
            Found a typo or want to improve this article? Click the button above to edit it directly on GitHub.
          </p>
        </div>
      )}
    </article>
  )
}

export default ArticleView
