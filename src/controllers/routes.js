import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';

const router = Router();

// MIDDLEWARE
// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

// Add faculty-specific styles to all faculty routes
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    next();
});

// BASIC ROUTES
router.get('/', homePage);
router.get('/about', aboutPage);

// SCHOOL ROUTES
// CATALOG ROUTES
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

// DEPARTMENT ROUTES
// router.get('/departments', departmentsPage);
// router.get('/departments/:departmentId', departmentsPage);

// FACULTY ROUTES
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

// DEMO & ERROR TEST ROUTES
router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);

export default router;