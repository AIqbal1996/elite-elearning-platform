import PathCard from '../components/PathCard.jsx';

export default function LearningPathsPage({ data, setActivePage }) {
  return (
    <main className="container page-stack">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Capability architecture</span>
        <h1>Role and skill-mapped learning paths</h1>
        <p>Catalogue data is transformed into role-based paths so learners can choose outcomes instead of searching raw rows.</p>
      </section>
      <section className="path-grid large">
        {data.learningPaths.map((path) => (
          <PathCard key={path.id} path={path} onOpenCourses={() => setActivePage('courses')} />
        ))}
      </section>
    </main>
  );
}
