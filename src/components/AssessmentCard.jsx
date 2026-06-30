import { ClipboardCheck } from 'lucide-react';

const levelClass = {
  Basic: 'level-basic',
  Intermediate: 'level-intermediate',
  Advanced: 'level-advanced'
};

export default function AssessmentCard({ assessment }) {
  return (
    <article className="assessment-card">
      <ClipboardCheck size={20} />
      <div>
        <h3>{assessment.skill}</h3>
        <p>{assessment.testName}</p>
      </div>
      <span className={`level-badge ${levelClass[assessment.level] || ''}`}>{assessment.level}</span>
    </article>
  );
}
