import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import { includesText, unique } from '../utils/helpers.js';

export default function ProjectsPage({ data }) {
  const [query, setQuery] = useState('');
  const stacks = useMemo(() => ['All', ...unique(data.pilots.map((project) => project.techStack)).sort()], [data.pilots]);
  const [activeStack, setActiveStack] = useState('All');
  const filtered = useMemo(() => data.pilots.filter((project) => {
    return (activeStack === 'All' || project.techStack === activeStack) && includesText(project, query, ['techStack', 'useCase', 'status']);
  }), [activeStack, data.pilots, query]);

  return (
    <main className="container page-stack">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Portfolio proof</span>
        <h1>Real-world use case showcase</h1>
        <p>Project data becomes a polished portfolio layer that makes the static learning portal feel enterprise-ready.</p>
      </section>
      <SearchFilters query={query} setQuery={setQuery} filters={stacks} activeFilter={activeStack} setActiveFilter={setActiveStack} placeholder="Search RAG, agent, migration, forecasting..." />
      <div className="project-grid">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
    </main>
  );
}
