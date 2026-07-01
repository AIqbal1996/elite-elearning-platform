import { Cpu, FileText } from 'lucide-react';

export default function ProjectCard({ project, isActive, onSelect }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(project);
    }
  };

  return (
    <article
      className={isActive ? 'project-card active selectable' : 'project-card selectable'}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={handleKeyDown}
    >
      <div className="project-number">
        {String(project.sno).padStart(2, '0')}
      </div>

      <div className="project-body">
        <span className="badge soft-purple">
          <Cpu size={14} /> {project.techStack}
        </span>

        <h3>{project.useCase}</h3>

        <div className="project-card-action">
          <FileText size={15} />
          View project details
        </div>
      </div>
    </article>
  );
}