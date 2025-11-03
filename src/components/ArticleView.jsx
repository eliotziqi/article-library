import { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './ArticleView.css'

// 手动解析 frontmatter 的函数
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }
  
  const [, frontmatterString, bodyContent] = match
  const data = {}
  
  // 简单解析 YAML frontmatter
  frontmatterString.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':')
      const value = valueParts.join(':').trim()
      // 移除引号
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
          // 使用自定义函数解析 frontmatter
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
      {/* 使用 frontmatter 中的 title，如果没有则使用传入的 title */}
      {(frontmatter.title || title) && (
        <h1 className="article-title">{frontmatter.title || title}</h1>
      )}
      
      {/* 如果有 summary，显示文章摘要 */}
      {frontmatter.summary && (
        <p className="article-summary">{frontmatter.summary}</p>
      )}
      
      {/* 只渲染正文内容，不包含 frontmatter */}
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
    </article>
  )
}

export default ArticleView
