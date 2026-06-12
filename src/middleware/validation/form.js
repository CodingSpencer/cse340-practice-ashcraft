import { body } from 'express-validator';

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be at least 2 characters and no more than 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, apostrophes, and hyphens'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email is too long (max 255 characters)'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be at least 8 characters and no more than 128 characters')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email is too long (max 255 characters)')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be at least 8 characters and no more than 128 characters')
];

const contactValidation = [
    body('subject')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Subject must be at least 2 characters and no more than 255 characters')
        .matches(/^[a-zA-Z0-9\s.,!?'-]+$/)
        .withMessage('Subject contains invalid characters'),
        
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be at least 10 characters and no more than 2000 characters')
        .custom((value) => {
            // Check for spam patterns (repetitive content)
            const words = value.split(/\s+/);
            const uniqueWords = new Set(words);
            
            // Adjusted logic: If the ratio of unique words to total words is low (< 0.3),
            // it means the text is highly repetitive (e.g., spam copy-paste).
            if (words.length > 20 && (uniqueWords.size / words.length) < 0.3) {
                throw new Error('Message appears to be spam due to repetitive content');
            }
            return true;
        })
];

export {
    registrationValidation,
    loginValidation,
    contactValidation,
}