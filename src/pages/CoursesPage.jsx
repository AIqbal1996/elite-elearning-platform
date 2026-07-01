import { useMemo, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import { includesText, unique } from '../utils/helpers.js';

export default function CoursesPage({ data }) {
  const [query, setQuery] = useState('');
  const categories = useMemo(() => ['All', ...unique(data.courses.map((course) => course.category)).sort()], [data.courses]);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCourses = useMemo(() => {
    return data.courses.filter((course) => {
      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
      const matchesQuery = includesText(course, query, ['courseName', 'category', 'source']) || (course.skills || []).join(' ').toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, data.courses, query]);

  return (
    <main className="container page-stack">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Course discovery</span>
        <h1>Browse the full learning catalogue</h1>
        <p>Search by course, tool, source, category or skill. Static data behaves like a live course marketplace.</p>
      </section>
      <SearchFilters
        query={query}
        setQuery={setQuery}
        filters={categories}
        activeFilter={activeCategory}
        setActiveFilter={setActiveCategory}
        placeholder="Search Python, AWS, SQL, Snowflake, Data Engineering..."
      />
      <div className="result-line">Showing <strong>{filteredCourses.length}</strong> courses</div>
      <section className="course-grid">
        {filteredCourses.map((course) => (
          <CourseCard
          key={course.id}
          course={course}
          globalCourses={data.globalCourses}
         />
        ))}
      </section>
    </main>
  );
}
