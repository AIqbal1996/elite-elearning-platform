import { useMemo, useState } from 'react';
import AssessmentCard from '../components/AssessmentCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import { includesText, unique } from '../utils/helpers.js';

export default function AssessmentsPage({ data }) {
  const [query, setQuery] = useState('');
  const levels = ['All', ...unique(data.assessments.map((item) => item.level))];
  const [activeLevel, setActiveLevel] = useState('All');

  const filtered = useMemo(() => data.assessments.filter((assessment) => {
    return (activeLevel === 'All' || assessment.level === activeLevel) && includesText(assessment, query, ['skill', 'level', 'testName']);
  }), [activeLevel, data.assessments, query]);

  return (
    <main className="container page-stack">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Skill validation</span>
        <h1>Assessment matrix</h1>
        <p>Difficulty badges create progress motivation and help learners move from basic to advanced capability.</p>
      </section>
      <SearchFilters query={query} setQuery={setQuery} filters={levels} activeFilter={activeLevel} setActiveFilter={setActiveLevel} placeholder="Search assessments by skill or test name..." />
      <div className="assessment-grid">{filtered.map((assessment) => <AssessmentCard key={assessment.id} assessment={assessment} />)}</div>
    </main>
  );
}
