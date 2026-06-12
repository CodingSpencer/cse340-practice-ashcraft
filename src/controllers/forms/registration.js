import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';
import { registrationValidation } from '../../middleware/validation/form.js';

const router = Router();

const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        errors.array().forEach(err => {
            req.flash('error', err.msg);
        });
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await emailExists(email);

        if (userExists) {
            console.log('Email already registered');
            req.flash('error', 'This email address is already registered. Please log in or use a different email.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await saveUser(name, email, hashedPassword);

        console.log('User registered successfully');
        req.flash('success', 'Registration successful! You can now log in with your credentials.');
        res.redirect('/register/list');
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showAllUsers = async (req, res) => {
    let users = [];

    try {
        users = await getAllUsers();
    } catch (error) {
        console.error('Error retrieving users:', error);
    }

    res.render('forms/registration/list', {
        title: 'Registered Users',
        users
    });
};

router.get('/', showRegistrationForm);

router.post('/', registrationValidation, processRegistration);

router.get('/list', showAllUsers);

router.post('/register', async (req, res) => {
    try {
        // Validate form data
        const errors = validateRegistration(req.body);
        if (errors.length > 0) {
            errors.forEach(err => req.flash('error', err));
            return res.redirect('/register');
        }

        // Create user account
        await createUser(req.body);

        // Success message
        req.flash('success', 'Registration complete! You can now log in.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error', 'An unexpected error occurred. Please try again.');
        res.redirect('/register');
    }
});

export default router;