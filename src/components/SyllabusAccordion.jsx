import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SyllabusAccordion({ syllabus }) {
  const [openId, setOpenId] = useState(syllabus.modules[0]?.id);

  return (
    <div className="syllabus-list">
      {syllabus.modules.map((module) => {
        const isOpen = openId === module.id;
        return (
          <article key={module.id} className={isOpen ? 'module-card open' : 'module-card'}>
            <button className="module-head" onClick={() => setOpenId(isOpen ? '' : module.id)}>
              <span className="module-index">{module.sno}</span>
              <span>
                <strong>{module.module}</strong>
                <small>{module.subtopics.length} subtopics</small>
              </span>
              <ChevronDown size={18} />
            </button>
            {isOpen ? (
              <ul className="subtopic-list">
                {module.subtopics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
