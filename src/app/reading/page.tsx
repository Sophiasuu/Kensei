import { Suspense } from 'react';
import ReadingContent from './ReadingContent';

export default function ReadingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="surface-panel max-w-md text-center">
          <p className="eyebrow">Compiling The Dossier</p>
          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
            Cross-checking Western, Vedic, Bazi, and numerology threads into a single readable report.
          </p>
        </div>
      </div>
    }>
      <ReadingContent />
    </Suspense>
  );
}
