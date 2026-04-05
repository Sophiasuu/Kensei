import { Suspense } from 'react';
import ReadingContent from './ReadingContent';

export default function ReadingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ color: 'var(--text-muted)', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          READING THE COSMOS…
        </div>
      </div>
    }>
      <ReadingContent />
    </Suspense>
  );
}
