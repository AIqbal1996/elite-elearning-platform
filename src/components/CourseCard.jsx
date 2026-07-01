import { ArrowUpRight, Clock3, Signal } from 'lucide-react';
import { formatDuration } from '../utils/helpers.js';

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function getCourseName(course) {
  return (
    course.courseName ||
    course['Course Name'] ||
    course.name ||
    ''
  );
}

function getCourseLink(item) {
  return (
    item.link ||
    item.Link ||
    item.url ||
    item.URL ||
    ''
  );
}

function getDuration(item) {
  return Number(
    item.durationHr ||
    item['Duration(Hr)'] ||
    item.duration ||
    0
  );
}

async function findCourseUrlFromCsv(course) {
  const directLink = getCourseLink(course);

  if (directLink && directLink !== '#') {
    return directLink;
  }

  const response = await fetch('/data/generated/global-courses.json');

  if (!response.ok) {
    throw new Error('Unable to load course links.');
  }

  const globalCourses = await response.json();

  const selectedCourseName = normalizeText(getCourseName(course));
  const selectedDuration = getDuration(course);

  const exactMatch = globalCourses.find((item) => {
    const sameName = normalizeText(getCourseName(item)) === selectedCourseName;
    const sameDuration = getDuration(item) === selectedDuration;
    const hasLink = Boolean(getCourseLink(item));

    return sameName && sameDuration && hasLink;
  });

  if (exactMatch) {
    return getCourseLink(exactMatch);
  }

  const nameMatch = globalCourses.find((item) => {
    const sameName = normalizeText(getCourseName(item)) === selectedCourseName;
    const hasLink = Boolean(getCourseLink(item));

    return sameName && hasLink;
  });

  return nameMatch ? getCourseLink(nameMatch) : '';
}

export default function CourseCard({ course }) {
  const handleStartLearning = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const courseUrl = await findCourseUrlFromCsv(course);

      if (!courseUrl) {
        alert('Course link is not available in Courses.csv.');
        return;
      }

      const finalUrl = courseUrl.startsWith('http://') || courseUrl.startsWith('https://')
      ? courseUrl
      : `https://${courseUrl}`;

window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      alert(error.message || 'Unable to open course link.');
    }
  };

  return (
    <article className="course-card">
      <div className="card-topline">
        <span className="badge soft-blue">{course.category}</span>

        <span className="duration">
          <Clock3 size={15} /> {formatDuration(course.durationHr)}
        </span>
      </div>

      <h3>{course.courseName}</h3>

      <div className="meta-line">
        <Signal size={15} /> {course.level} Track
      </div>

      <div className="skill-list">
        {(course.skills || []).slice(0, 3).map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <button
        type="button"
        className="text-link course-link-button"
        onClick={handleStartLearning}
      >
        Start learning <ArrowUpRight size={16} />
      </button>
    </article>
  );
}