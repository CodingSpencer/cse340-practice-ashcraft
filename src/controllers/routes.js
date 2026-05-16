import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage, departmentsPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';

const router = Router();

// BASIC ROUTES
router.get('/', homePage);
router.get('/about', aboutPage);

// SCHOOL ROUTES
// CATALOG ROUTES
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// DEPARTMENT ROUTES
router.get('/departments', departmentsPage);
router.get('/departments/:departmentId', departmentsPage);

// FACULTY ROUTES
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

// DEMO & ERROR TEST ROUTES
router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);

export default router;