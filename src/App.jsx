import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  Compass,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';

import { loadLearningData } from './data/learningService.js';
import HomePage from './pages/HomePage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import LearningPathsPage from './pages/LearningPathsPage.jsx';
import AssessmentsPage from './pages/AssessmentsPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import SyllabusPage from './pages/SyllabusPage.jsx';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'paths', label: 'Learning Paths', icon: Compass },
  { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
  { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
  { id: 'syllabus', label: 'Syllabus', icon: GraduationCap }
];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLearningData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const page = useMemo(() => {
    if (!data) return null;

    const props = { data, setActivePage };

    switch (activePage) {
      case 'courses':
        return <CoursesPage {...props} />;

      case 'paths':
        return <LearningPathsPage {...props} />;

      case 'assessments':
        return <AssessmentsPage {...props} />;

      case 'projects':
        return <ProjectsPage {...props} />;

      case 'syllabus':
        return <SyllabusPage {...props} />;

      default:
        return <HomePage {...props} />;
    }
  }, [activePage, data]);

  if (error) {
    return (
      <div className="app-shell">
        <div className="error-card">{error}</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setActivePage('home')}>
          <span className="brand-mark">LH</span>

          <span>
            <strong>HCL Learning Hub</strong>
            <small>Enterprise Learning Portal</small>
          </span>
        </button>

        <nav className="nav-pills" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={activePage === item.id ? 'nav-pill active' : 'nav-pill'}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {!data ? <LoadingState /> : page}

      <footer className="footer">
        <span>© 2026 HCL Learning Hub. All rights reserved.</span>

        <span>
          Developed by <strong>Arif Iqbal</strong> | Email:{' '}
          <a href="mailto:arif.iqbal@hcltech.com">Arif.Iqbal@hcltech.com</a>
        </span>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="container loading-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="skeleton-card" key={index} />
      ))}
    </main>
  );
}