import Link from 'next/link';
import Nav from './components/Nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="top">
        <div className="not-found">
          <h1>404</h1>
          <p>This page wandered off somewhere.</p>
          <Link href="/">← back home</Link>
        </div>
      </main>
    </>
  );
}
