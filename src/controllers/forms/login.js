import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';
import { loginValidation } from '../../middleware/validation/form.js';

const router = Router();

const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'User Login'
    });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        errors.array().forEach(err => {
            req.flash('error', err.msg);
        });
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            console.error('User not found');
            req.flash('error', 'Email or password is incorrect');
            return res.redirect('/login');
        }

        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            console.error('Invalid password');
            req.flash('error', 'Email or password is incorrect');
            return res.redirect('/login');
        }

        delete user.password;

        req.session.user = user;
        req.flash('success', 'Login successful! Welcome back.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.flash('success', 'You have been successfully logged out.');
    req.session.user = null;
    res.clearCookie('connect.sid');

    req.session.destroy((err) => {
        if (err) {
            console.error('Non-blocking session destruction error:', err);
        }
    });

    return res.redirect('/');
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    res.render('forms/login/dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout, showDashboard };