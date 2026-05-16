import { getAllCourses, getCourseById, getSortedSections, getCoursesByDepartment } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
const catalogPage = (req, res) => {
    const courses = getAllCourses();

    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
};

// Route handler for individual course detail pages
const courseDetailPage = (req, res, next) => {
    const courseId = req.params.courseId;
    const course = getCourseById(courseId);

    // If course doesn't exist, create 404 error
    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'time';
    const sortedSections = getSortedSections(course.sections, sortBy);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy,
        nodeEnv: process.env.NODE_ENV || 'development'
    });
};

/**
 * Renders the departments index page, grouping courses by their respective departments.
 */
const departmentsPage = (req, res, next) => {
    try {
        // Fetch the grouped data from your model
        const departmentsData = getCoursesByDepartment();

        // Render the view, passing along the title and data payload
        res.render('departments', {
            title: 'Departments Overview',
            departments: departmentsData
        });
    } catch (err) {
        // Cleanly catch any failures and pass them to your central server.js error handler
        next(err);
    }
};

export { catalogPage, courseDetailPage, departmentsPage };