import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import CourseCard from '../components/CourseCard.jsx';
import PathCard from '../components/PathCard.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import StatCard from '../components/StatCard.jsx';

export default function HomePage({ data, setActivePage }) {
  const featuredCourses = data.courses.slice(0, 6);
  const featuredPaths = data.learningPaths.slice(0, 3);
  const featuredProjects = data.pilots.slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow"><ShieldCheck size={16} /> Enterprise-grade learning experience</span>
          <h1>Build data, AI, cloud and engineering skills with a premium guided academy.</h1>
          <p>
            A Coursera-inspired static learning platform powered by your Excel and CSV files, designed to look polished today and connect to APIs tomorrow.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActivePage('courses')}>Explore Courses <ArrowRight size={18} /></button>
            <button className="secondary-button" onClick={() => setActivePage('paths')}>View Learning Paths</button>
          </div>
        </div>
        <aside className="hero-panel">
          <span className="badge soft-blue"><Sparkles size={14} /> Personalized pathway preview</span>
          <h2>Data Engineering - Cloud Platform</h2>
          <div className="progress-row"><span>Foundations</span><strong>100%</strong></div>
          <div className="progress-bar"><span style={{ width: '100%' }} /></div>
          <div className="progress-row"><span>Intermediate AWS</span><strong>68%</strong></div>
          <div className="progress-bar"><span style={{ width: '68%' }} /></div>
          <div className="progress-row"><span>Advanced Capstone</span><strong>34%</strong></div>
          <div className="progress-bar"><span style={{ width: '34%' }} /></div>
        </aside>
      </section>

      <section className="container stats-grid">
        <StatCard label="Courses" value={data.stats.totalCourses} hint="Training + global master" />
        <StatCard label="Skill Areas" value={data.stats.skills} hint="Mapped from catalogue" />
        <StatCard label="Assessments" value={data.stats.assessments} hint="Skill validation tests" />
        <StatCard label="Completed Use Cases" value={data.stats.completedProjects} hint="Pilot project showcase" />
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <div><span className="eyebrow">Role-based journeys</span><h2>Learning paths that reduce decision fatigue</h2></div>
          <button className="inline-button" onClick={() => setActivePage('paths')}>See all paths <ArrowRight size={16} /></button>
        </div>
        <div className="path-grid">{featuredPaths.map((path) => <PathCard key={path.id} path={path} onOpenCourses={() => setActivePage('courses')} />)}</div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <div><span className="eyebrow">Featured catalogue</span><h2>Recommended courses</h2></div>
          <button className="inline-button" onClick={() => setActivePage('courses')}>Browse catalogue <ArrowRight size={16} /></button>
        </div>
        <div className="course-grid">{featuredCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <div><span className="eyebrow">Proof of capability</span><h2>Real-world project showcase</h2></div>
          <button className="inline-button" onClick={() => setActivePage('projects')}>View projects <ArrowRight size={16} /></button>
        </div>
        <div className="project-grid">{featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </section>
    </main>
  );
}
