import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage, departmentsPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';

const router = Router();

// BASIC ROUTES
router.get('/', homePage);
router.get('/about', aboutPage);

// CATALOG & DEPARTMENTS ROUTES
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);
router.get('/departments', departmentsPage);

// DEMO & ERROR TEST ROUTES
router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);

export default router;