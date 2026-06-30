import { useState } from 'react';
import SyllabusAccordion from '../components/SyllabusAccordion.jsx';

export default function SyllabusPage({ data }) {
  const [subject, setSubject] = useState('Python');
  const syllabus = subject === 'Python' ? data.pythonSyllabus : data.sqlSyllabus;

  return (
    <main className="container page-stack">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Curriculum design</span>
        <h1>Structured syllabus with progressive disclosure</h1>
        <p>Long module lists are converted into collapsible learning blocks to reduce cognitive load.</p>
      </section>
      <div className="tab-switcher">
        {['Python', 'SQL'].map((item) => <button key={item} className={subject === item ? 'active' : ''} onClick={() => setSubject(item)}>{item}</button>)}
      </div>
      <section className="syllabus-summary">
        <div><strong>{syllabus.totalModules}</strong><span>Modules</span></div>
        <div><strong>{syllabus.totalSubtopics}</strong><span>Subtopics</span></div>
        <div><strong>{syllabus.subject}</strong><span>Track</span></div>
      </section>
      <SyllabusAccordion syllabus={syllabus} />
    </main>
  );
}
