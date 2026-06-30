import { CheckCircle2, Cpu } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-number">{String(project.sno).padStart(2, '0')}</div>
      <div className="project-body">
        <span className="badge soft-purple"><Cpu size={14} /> {project.techStack}</span>
        <h3>{project.useCase}</h3>
        <div className="status"><CheckCircle2 size={16} /> {project.status}</div>
      </div>
    </article>
  );
}
