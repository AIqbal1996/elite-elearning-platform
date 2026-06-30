import { ArrowRight, Layers3 } from 'lucide-react';

export default function PathCard({ path, onOpenCourses }) {
  return (
    <article className="path-card">
      <div className="path-icon"><Layers3 size={22} /></div>
      <h3>{path.category}</h3>
      <p>{path.capabilities.slice(0, 2).join(' • ') || 'Role-based capability pathway'}</p>
      <div className="skill-list compact">
        {path.skills.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}
      </div>
      <div className="path-metrics">
        <span>{path.courseCount} courses</span>
        <span>{path.assessmentCount} tests</span>
      </div>
      <button className="inline-button" onClick={onOpenCourses}>Explore path <ArrowRight size={16} /></button>
    </article>
  );
}
