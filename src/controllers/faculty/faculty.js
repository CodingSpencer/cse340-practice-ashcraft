import * as facultyModel from '../../models/faculty/faculty.js';

const facultyListPage = async (req, res, next) => {
    try {
        const sortBy = req.query.sort || 'name';
        
        // Calls the wrapper function pointing to getSortedFaculty('name')
        const facultyData = await facultyModel.getSortedFaculty(sortBy);

        res.render('faculty/list', {
            title: 'Faculty List',
            greeting: 'Welcome to the Faculty Directory', 
            bodyClass: 'faculty-page',                 
            faculty: facultyData 
        });
    } catch (error) {
        next(error);
    }
};

const facultyDetailPage = async (req, res, next) => {
    try {
        const facultyId = req.params.facultyId;

        // Validation updated: Ensures the ID is a string slug and not empty/whitespace
        if (!facultyId || typeof facultyId !== 'string' || facultyId.trim() === '') {
            const invalidErr = new Error(`Invalid Faculty ID format: "${facultyId}"`);
            invalidErr.status = 400; 
            return next(invalidErr);
        }

        const faculty = await facultyModel.getFacultyById(facultyId);

        // If faculty member doesn't exist in the data object, trigger a 404
        if (!faculty) {
            const notFoundErr = new Error(`Faculty member "${facultyId}" not found`);
            notFoundErr.status = 404;
            return next(notFoundErr);
        }

        res.render('faculty/detail', {
            title: faculty.name,
            faculty: faculty
        });
    } catch (error) {
        next(error);
    }
};

export { facultyListPage, facultyDetailPage };