import { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import './ArticleView.css'

function ArticleView({ articlePath, title }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadArticle() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(articlePath)
        if (!response.ok) {
          throw new Error(`Failed to load article (status ${response.status})`)
        }

        const text = await response.text()
        if (!cancelled) {
          setContent(text)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setContent('')
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
      {title ? <h1 className="article-title">{title}</h1> : null}
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  )
}

export default ArticleView
