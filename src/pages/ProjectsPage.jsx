import { useEffect, useMemo, useState } from 'react';

import ProjectCard from '../components/ProjectCard.jsx';
import PilotPdfViewer from '../components/PilotPdfViewer.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import { includesText, unique } from '../utils/helpers.js';

export default function ProjectsPage({ data }) {
  const [query, setQuery] = useState('');
  const [activeStack, setActiveStack] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const stacks = useMemo(() => {
    return ['All', ...unique(data.pilots.map((project) => project.techStack)).sort()];
  }, [data.pilots]);

  const filtered = useMemo(() => {
    return data.pilots.filter((project) => {
      return (
        (activeStack === 'All' || project.techStack === activeStack) &&
        includesText(project, query, ['techStack', 'useCase'])
      );
    });
  }, [activeStack, data.pilots, query]);

  useEffect(() => {
    if (!filtered.length) {
      setSelectedProjectId('');
      return;
    }

    const selectedStillVisible = filtered.some((project) => project.id === selectedProjectId);

    if (!selectedStillVisible) {
      setSelectedProjectId(filtered[0].id);
    }
  }, [filtered, selectedProjectId]);

  const selectedProject = useMemo(() => {
    return filtered.find((project) => project.id === selectedProjectId) || filtered[0] || null;
  }, [filtered, selectedProjectId]);

  const handleProjectSelect = (project) => {
    setSelectedProjectId(project.id);

    setTimeout(() => {
      document.getElementById('pilot-detail-viewer')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  };

  return (
    <main className="container page-stack">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Portfolio proof</span>
        <h1>Real-world use case showcase</h1>
        <p>
          Select any use case to view its mapped project detail page from the pilot PDF.
          The page mapping comes from the S no column in the Pilots sheet.
        </p>
      </section>

      <SearchFilters
        query={query}
        setQuery={setQuery}
        filters={stacks}
        activeFilter={activeStack}
        setActiveFilter={setActiveStack}
        placeholder="Search RAG, agent, migration, forecasting..."
      />

      <div className="project-grid">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isActive={selectedProject?.id === project.id}
            onSelect={handleProjectSelect}
          />
        ))}
      </div>

      <PilotPdfViewer project={selectedProject} />
    </main>
  );
}