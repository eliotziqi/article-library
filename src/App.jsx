import { Link, Route, Routes } from 'react-router-dom'
import { Button, Card, Container, Nav, Navbar } from 'react-bootstrap'
import ArticleView from './components/ArticleView.jsx'
import './App.css'

function Home() {
  return (
    <section className="py-4">
      <header className="mb-4 text-center text-md-start">
        <h1 className="fw-bold mb-3">Article Library</h1>
        <p className="lead mb-0 text-muted">
          Explore long-form writing rendered straight from Markdown files. Start with the
          sample article below to see how content is presented in the library.
        </p>
      </header>

      <Card className="shadow-sm">
        <Card.Body className="d-flex flex-column flex-md-row align-items-md-center">
          <div>
            <Card.Title as="h2" className="h4 fw-semibold mb-2">
              Getting started
            </Card.Title>
            <Card.Text className="text-muted mb-3 mb-md-0">
              The sample article demonstrates code blocks, lists, and quotes so you can verify
              the Markdown rendering pipeline end-to-end.
            </Card.Text>
          </div>
          <Button as={Link} to="/articles/sample" variant="primary" className="ms-md-auto">
            Read the sample article
          </Button>
        </Card.Body>
      </Card>
    </section>
  )
}

function NotFound() {
  return (
    <section className="py-5 text-center">
      <h1 className="display-6 fw-semibold mb-3">Page not found</h1>
      <p className="text-muted mb-4">
        We couldn&apos;t locate the page you were after. Return home to keep exploring the library.
      </p>
      <Button as={Link} to="/" variant="outline-primary">
        Back to home
      </Button>
    </section>
  )
}

function App() {
  return (
    <div className="app-frame">
      <Navbar bg="dark" data-bs-theme="dark" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Article Library
          </Navbar.Brand>
          <Nav className="ms-md-auto">
            <Nav.Link as={Link} to="/articles/sample">
              Sample article
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <main className="py-4">
        <Container>
          <Routes>
            <Route index element={<Home />} />
            <Route
              path="/articles/sample"
              element={<ArticleView articlePath="/articles/sample-article.md" title="Sample article" />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
    </div>
  )
}

export default App
