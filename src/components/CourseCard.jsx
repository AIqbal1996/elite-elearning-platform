import { ArrowUpRight, Clock3, Signal } from 'lucide-react';
import { formatDuration } from '../utils/helpers.js';

export default function CourseCard({ course }) {
  return (
    <article className="course-card">
      <div className="card-topline">
        <span className="badge soft-blue">{course.category}</span>
        <span className="duration"><Clock3 size={15} /> {formatDuration(course.durationHr)}</span>
      </div>
      <h3>{course.courseName}</h3>
      <div className="meta-line"><Signal size={15} /> {course.level} Track</div>
      <div className="skill-list">
        {(course.skills || []).slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}
      </div>
      <div className="card-actions">
        <a href={course.link || '#'} target="_blank" rel="noreferrer" className="text-link">
          Start learning <ArrowUpRight size={16} />
        </a>
        {course.secondaryLink ? <a href={course.secondaryLink} target="_blank" rel="noreferrer" className="text-link muted">Resource 2</a> : null}
      </div>
    </article>
  );
}
