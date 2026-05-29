import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';

import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

// MIDDLEWARE
// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/components/pages/catalog.css">');
    next();
});

// Add faculty-specific styles to all faculty routes
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/components/pages/faculty.css">');
    next();
});

// Add contact-specific styles to all contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/components/pages/contact.css">');
    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/components/sections/registration.css">');
    next();
});

// Add login-specific styles to all login routes
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/components/pages/login.css">');
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

// Contact form routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;