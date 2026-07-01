const DATA_ROOT = '/data/generated';

async function getJson(fileName) {
  const response = await fetch(`${DATA_ROOT}/${fileName}`);

  if (!response.ok) {
    throw new Error(`Unable to load ${fileName}`);
  }

  return response.json();
}

export async function loadLearningData() {
  const [
    stats,
    courses,
    globalCourses,
    learningPaths,
    assessments,
    pilots,
    syllabi,
    pythonSyllabus,
    sqlSyllabus
  ] = await Promise.all([
    getJson('stats.json'),
    getJson('courses.json'),
    getJson('global-courses.json'),
    getJson('learning-paths.json'),
    getJson('assessments.json'),
    getJson('pilots.json'),
    getJson('syllabi.json'),
    getJson('syllabus-python.json'),
    getJson('syllabus-sql.json')
  ]);

  return {
    stats,
    courses,
    globalCourses,
    learningPaths,
    assessments,
    pilots,
    syllabi,
    pythonSyllabus,
    sqlSyllabus
  };
}