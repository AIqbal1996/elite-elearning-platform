import { useEffect, useMemo, useState } from 'react';
import SyllabusAccordion from '../components/SyllabusAccordion.jsx';

export default function SyllabusPage({ data }) {
  const syllabusList = useMemo(() => {
    if (Array.isArray(data.syllabi) && data.syllabi.length > 0) {
      return data.syllabi;
    }

    return [data.pythonSyllabus, data.sqlSyllabus].filter(Boolean);
  }, [data]);

  const [subject, setSubject] = useState(syllabusList[0]?.subject || '');

  useEffect(() => {
    if (!subject && syllabusList.length > 0) {
      setSubject(syllabusList[0].subject);
    }
  }, [subject, syllabusList]);

  const syllabus = useMemo(() => {
    return (
      syllabusList.find((item) => item.subject === subject) ||
      syllabusList[0] ||
      {
        subject: 'No Syllabus',
        modules: [],
        totalModules: 0,
        totalSubtopics: 0
      }
    );
  }, [subject, syllabusList]);

  return (
    <main className="container page-stack">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Curriculum design</span>
        <h1>Structured syllabus with progressive disclosure</h1>
        <p>
          Each syllabus tab is generated directly from the sheet names inside Courses.xlsx.
        </p>
      </section>

      <div className="tab-switcher">
        {syllabusList.map((item) => (
          <button
            key={item.subject}
            className={subject === item.subject ? 'active' : ''}
            onClick={() => setSubject(item.subject)}
          >
            {item.subject}
          </button>
        ))}
      </div>

      <section className="syllabus-summary">
        <div>
          <strong>{syllabus.totalModules}</strong>
          <span>Modules</span>
        </div>

        <div>
          <strong>{syllabus.totalSubtopics}</strong>
          <span>Subtopics</span>
        </div>

        <div>
          <strong>{syllabus.subject}</strong>
          <span>Track</span>
        </div>
      </section>

      <SyllabusAccordion key={syllabus.subject} syllabus={syllabus} />
    </main>
  );
}