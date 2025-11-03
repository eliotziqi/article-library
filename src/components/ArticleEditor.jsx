import { useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap'

function ArticleEditor() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    author: '',
    created: new Date().toISOString().split('T')[0], // Today's date
    content: ''
  })
  const [generatedMarkdown, setGeneratedMarkdown] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear success message when editing
    if (successMessage) setSuccessMessage('')
  }

  const generateMarkdown = () => {
    const frontmatter = `---
title: ${formData.title}
summary: ${formData.summary}
author: ${formData.author}
created: ${formData.created}
---

${formData.content}`

    setGeneratedMarkdown(frontmatter)
    setShowPreview(true)
  }

  const downloadMarkdown = () => {
    if (!generatedMarkdown) {
      generateMarkdown()
    }
    
    const filename = formData.title
      ? `${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`
      : 'article.md'
    
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!generatedMarkdown) {
      generateMarkdown()
    }
    try {
      await navigator.clipboard.writeText(generatedMarkdown || `---
title: ${formData.title}
summary: ${formData.summary}
author: ${formData.author}
created: ${formData.created}
---

${formData.content}`)
      setSuccessMessage('Copied to clipboard!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const loadSampleContent = () => {
    setFormData({
      title: 'Sample Article',
      summary: 'A comprehensive example demonstrating various Markdown features.',
      author: 'Article Library Team',
      created: new Date().toISOString().split('T')[0],
      content: `# Welcome to the Article Library

This sample article illustrates how Markdown is rendered in the application. It includes several typical elements you may rely on when writing long-form documentation.

## Key Features

- **Headings** from level one through level three
- Paragraph text with thoughtful spacing
- Inline code such as \`npm install\` for command snippets
- Syntax highlighted code blocks

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('reader'))
\`\`\`

## Pull quotes

> Great documentation is just like great storytelling—it guides the reader with clarity and intentional structure.

### Next steps

1. Replace this Markdown file with your own content.
2. Add more routes that map to additional articles.
3. Polish the styling to match your brand.

| Status | Description |
| ------ | ----------- |
| ✅     | Markdown file loaded and displayed |
| 🛠️    | Ready for customization |

Happy writing!`
    })
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 className="mb-4">Article Editor</h1>
          <p className="text-muted mb-4">
            Create and edit articles with frontmatter metadata. Generate downloadable Markdown files for your article library.
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Article Details</h5>
                <Button variant="outline-secondary" size="sm" onClick={loadSampleContent}>
                  Load Sample
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Article title"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="Author name"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Created Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.created}
                      onChange={(e) => handleInputChange('created', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief description of the article"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content (Markdown)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={15}
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your article content here using Markdown..."
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Group>

              <div className="d-grid gap-2 d-md-flex">
                <Button variant="primary" onClick={generateMarkdown}>
                  <i className="bi bi-eye me-2"></i>
                  Generate Preview
                </Button>
                <Button variant="success" onClick={downloadMarkdown}>
                  <i className="bi bi-download me-2"></i>
                  Download .md
                </Button>
                <Button variant="outline-secondary" onClick={copyToClipboard}>
                  <i className="bi bi-clipboard me-2"></i>
                  Copy
                </Button>
              </div>

              {successMessage && (
                <Alert variant="success" className="mt-3 mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  {successMessage}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          {showPreview && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Generated Markdown</h5>
              </Card.Header>
              <Card.Body>
                <pre className="bg-light p-3 rounded" style={{ 
                  fontSize: '0.875rem',
                  maxHeight: '500px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {generatedMarkdown}
                </pre>
              </Card.Body>
            </Card>
          )}

          {!showPreview && (
            <Alert variant="info">
              <Alert.Heading>Instructions</Alert.Heading>
              <ul className="mb-0">
                <li>Fill in the article details and content</li>
                <li>Click "Generate Preview" to see the Markdown output</li>
                <li>Use "Download .md" to save the file locally</li>
                <li>Copy the generated Markdown to clipboard if needed</li>
                <li>Place the file in <code>public/articles/</code> directory</li>
                <li>Add a new route in <code>App.jsx</code> to display the article</li>
              </ul>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleEditor