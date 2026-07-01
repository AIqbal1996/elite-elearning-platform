import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const root = process.cwd();
const rawDir = path.join(root, 'public', 'data', 'raw');
const outDir = path.join(root, 'public', 'data', 'generated');
fs.mkdirSync(outDir, { recursive: true });

const slugify = (text) => String(text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
const toNumber = (value) => value === undefined || value === null || value === '' ? null : Number(value);
const cleanLevel = (level) => ({ baisc: 'Basic', basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced' }[String(level || '').toLowerCase()] || level || 'Unknown');
const sheetRows = (workbook, sheetName) => XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: null }).map((row) => row.map((cell) => typeof cell === 'string' ? cell.trim() : cell));
const writeJson = (name, data) => fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));

const coursesWb = XLSX.readFile(path.join(rawDir, 'Courses.xlsx'));
const assessmentsWb = XLSX.readFile(path.join(rawDir, 'Hacker_Rank_assessments.xlsx'));
const pilotsWb = XLSX.readFile(path.join(rawDir, 'Pilots.xlsx'));

let currentCapability = '';
let currentCategory = '';
const catalogue = sheetRows(coursesWb, 'Catalogue').slice(1).flatMap((row) => {
  if (row[0]) currentCapability = row[0];
  if (row[2]) currentCategory = row[2];
  if (!row[1]) return [];
  return [{ id: slugify(`${currentCapability}-${row[1]}-${currentCategory}`), capability: currentCapability, skill: row[1], category: currentCategory }];
});

const training = sheetRows(coursesWb, 'Training').slice(1).flatMap((row, index) => {
  const clean = [...row];
  while (clean.length && !clean[0]) clean.shift();
  if (!clean[0]) return [];
  return [{ id: slugify(`training-${index}-${clean[0]}-${clean[1]}`), courseName: clean[0], link: clean[1], durationHr: toNumber(clean[2]), source: 'Courses.xlsx / Training' }];
});

function normalizeSyllabus(subject, rows) {
  const modules = [];
  let current = null;
  rows.slice(2).forEach((row) => {
    if (row[1]) {
      current = { id: slugify(`${subject}-${row[0]}-${row[1]}`), sno: String(row[0] || modules.length + 1).replace('.0', ''), module: row[1], subtopics: [] };
      modules.push(current);
    }
    if (row[2] && current) current.subtopics.push(row[2]);
  });
  return { subject, modules, totalModules: modules.length, totalSubtopics: modules.reduce((sum, mod) => sum + mod.subtopics.length, 0) };
}

const excludedCourseSheets = ['Catalogue', 'Training'];

const syllabi = coursesWb.SheetNames
  .filter((sheetName) => !excludedCourseSheets.includes(sheetName))
  .map((sheetName) => normalizeSyllabus(sheetName, sheetRows(coursesWb, sheetName)))
  .filter((syllabus) => syllabus.modules.length > 0);

const pythonSyllabus = syllabi.find((item) => item.subject === 'Python') || {
  subject: 'Python',
  modules: [],
  totalModules: 0,
  totalSubtopics: 0
};

const sqlSyllabus = syllabi.find((item) => item.subject === 'SQL') || {
  subject: 'SQL',
  modules: [],
  totalModules: 0,
  totalSubtopics: 0
};

const assessments = sheetRows(assessmentsWb, 'Sheet1').slice(1).flatMap((row, index) => row[0] && row[2] ? [{ id: slugify(`assessment-${index}-${row[0]}-${row[1]}-${row[2]}`), skill: String(row[0]).replace('Python,SQL', 'Python, SQL'), level: cleanLevel(row[1]), testName: row[2] }] : []);
const pilots = sheetRows(pilotsWb, 'Sheet1').slice(1).flatMap((row, index) => {
  if (!row[2]) return [];

  const pageNumber = Number(row[1] || index + 1);

  return [{
    id: slugify(`pilot-${index}-${row[2]}`),
    techStack: row[0],
    sno: pageNumber,
    pdfPage: pageNumber,
    useCase: row[2],
    status: row[3]
  }];
});
const csvWorkbook = XLSX.readFile(path.join(rawDir, 'Courses.csv'));
const csvRows = XLSX.utils.sheet_to_json(csvWorkbook.Sheets[csvWorkbook.SheetNames[0]], { defval: '' });
const globalCourses = csvRows.filter((row) => row['Course Name']).map((row, index) => ({ id: slugify(`global-${index}-${row['Course Name']}-${row.Link}`), courseName: row['Course Name'], link: row.Link, durationHr: toNumber(row['Duration(Hr)']), secondaryLink: row.Link_1, source: 'Courses.csv' }));

const skillTerms = [...new Set(catalogue.map((item) => item.skill))].sort((a, b) => b.length - a.length);
const categoryBySkill = Object.fromEntries(catalogue.map((item) => [item.skill.toLowerCase(), item.category]));
function enrichCourse(course) {
  const low = course.courseName.toLowerCase();
  let skills = skillTerms.filter((skill) => low.includes(skill.toLowerCase())).slice(0, 3);
  if (!skills.length) skills = ['Professional Learning'];
  const category = skills.map((skill) => categoryBySkill[skill.toLowerCase()]).find(Boolean) || (low.includes('cloud') ? 'Cloud Data Stacks' : low.includes('sql') ? 'Data Platforms & Warehouses' : low.includes('python') ? 'Data Engineering' : 'Core Skills');
  const duration = course.durationHr;
  const level = duration !== null && duration <= 4 ? 'Beginner' : duration !== null && duration <= 30 ? 'Intermediate' : 'Advanced';
  return { ...course, skills, category, level };
}
const courses = [...training, ...globalCourses].map(enrichCourse);
const pathsMap = new Map();
catalogue.forEach((item) => {
  if (!pathsMap.has(item.category)) pathsMap.set(item.category, { id: slugify(item.category), category: item.category, capabilities: [], skills: [], courseCount: 0, assessmentCount: 0 });
  const path = pathsMap.get(item.category);
  if (item.capability && !path.capabilities.includes(item.capability)) path.capabilities.push(item.capability);
  if (!path.skills.includes(item.skill)) path.skills.push(item.skill);
});
const learningPaths = [...pathsMap.values()].map((path) => ({ ...path, courseCount: courses.filter((course) => course.category === path.category).length, assessmentCount: assessments.filter((a) => path.skills.some((s) => a.skill.toLowerCase().includes(s.toLowerCase().split(' ')[0]))).length }));
const stats = {
  totalCourses: courses.length,
  trainingCourses: training.length,
  globalCourses: globalCourses.length,
  categories: learningPaths.length,
  skills: catalogue.length,
  assessments: assessments.length,
  projects: pilots.length,
  completedProjects: pilots.filter((p) => String(p.status).toLowerCase() === 'completed').length,
  syllabusTracks: syllabi.length,
  pythonModules: pythonSyllabus.totalModules,
  sqlModules: sqlSyllabus.totalModules
};

writeJson('catalogue.json', catalogue);
writeJson('training.json', training);
writeJson('global-courses.json', globalCourses);
writeJson('courses.json', courses);
writeJson('syllabus-python.json', pythonSyllabus);
writeJson('syllabus-sql.json', sqlSyllabus);
writeJson('syllabi.json', syllabi);
writeJson('assessments.json', assessments);
writeJson('pilots.json', pilots);
writeJson('learning-paths.json', learningPaths);
writeJson('stats.json', stats);
console.log('Data import complete:', stats);
