import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ExternalLink, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PILOT_PDF_URL = '/data/raw/pilot-details.pdf';

export default function PilotPdfViewer({ project }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pageNumber = useMemo(() => {
    return Number(project?.pdfPage || project?.sno || 1);
  }, [project]);

  useEffect(() => {
    if (!project) return;

    let cancelled = false;
    let renderTask = null;

    async function renderPdfPage() {
      try {
        setLoading(true);
        setError('');

        const loadingTask = pdfjsLib.getDocument({
        url: PILOT_PDF_URL
    });
        const pdf = await loadingTask.promise;

        if (pageNumber > pdf.numPages) {
          throw new Error(`PDF has only ${pdf.numPages} pages. Selected page is ${pageNumber}.`);
        }

        const page = await pdf.getPage(pageNumber);

        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;

        if (!canvas || !wrapper || cancelled) return;

        const context = canvas.getContext('2d');

        const maxWidth = Math.min(wrapper.clientWidth - 32, 980);
        const defaultViewport = page.getViewport({ scale: 1 });
        const scale = maxWidth / defaultViewport.width;
        const viewport = page.getViewport({ scale });

        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

        renderTask = page.render({
          canvasContext: context,
          viewport
        });

        await renderTask.promise;

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          setError(err.message || 'Failed to render PDF page.');
        }
      }
    }

    renderPdfPage();

    return () => {
      cancelled = true;

      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [project, pageNumber]);

  if (!project) {
    return (
      <section className="pilot-detail-panel empty">
        <FileText size={24} />
        <h2>Select a use case</h2>
        <p>Select any project card to view its mapped PDF page.</p>
      </section>
    );
  }

  return (
    <section className="pilot-detail-panel" id="pilot-detail-viewer">
      <div className="pilot-detail-header">
        <div>
          <span className="eyebrow">Project detail preview</span>
          <h2>{project.useCase}</h2>

          <div className="viewer-meta">
            <span>{project.techStack}</span>
            <span>PDF Page {pageNumber}</span>
          </div>
        </div>

        <a
          className="open-pdf-link"
          href={`${PILOT_PDF_URL}#page=${pageNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          Open PDF <ExternalLink size={15} />
        </a>
      </div>

      <div className="pdf-stage" ref={wrapperRef}>
        {loading && <div className="pdf-loading">Loading page {pageNumber}...</div>}

        {error && (
          <div className="pdf-error">
            <AlertCircle size={22} />
            <strong>PDF page failed to render.</strong>
            <p>{error}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={loading || error ? 'pdf-canvas hidden' : 'pdf-canvas'}
        />
      </div>
    </section>
  );
}