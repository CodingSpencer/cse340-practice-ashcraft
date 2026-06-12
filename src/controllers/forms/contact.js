import { Router } from 'express';
import { validationResult } from 'express-validator';
import { createContactForm, getAllContactForms } from '../../models/forms/contact.js';
import { contactValidation } from "../../middleware/validation/form.js";

const router = Router();

/**
 * Display the contact form page.
 */
const showContactForm = (req, res) => {
    res.render('forms/contact/form', {
        title: 'Contact Us'
    });
};

/**
 * Handle contact form submission with validation.
 * If validation passes, save to database and redirect.
 * If validation fails, log errors and redirect back to form.
 */
const handleContactSubmission = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Log validation errors for developer debugging
        console.error('Validation errors:', errors.array());
        // Set flash messages for each validation error
        errors.array().forEach(err => {
            req.flash('error', err.msg);
        });
        // Redirect back to form without saving
        return res.redirect('/contact');
    }

    // Extract validated data
    const { subject, message } = req.body;

    try {
        // Save to database
        await createContactForm(subject, message);
        console.log('Contact form submitted successfully');
        req.flash('success', 'Thank you! Your message has been received. We will respond as soon as possible.');
        // Redirect to responses page on success
        res.redirect('/contact/responses');
    } catch (error) {
        console.error('Error saving contact form:', error);
        req.flash('error', 'An error occurred while saving your message. Please try again.');
        res.redirect('/contact');
    }
};

/**
 * Display all contact form submissions.
 */
const showContactResponses = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getAllContactForms();
    } catch (error) {
        console.error('Error retrieving contact forms:', error);
    }

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms
    });
};

/**
 * GET /contact - Display the contact form
 */
router.get('/', showContactForm);

/**
 * POST /contact - Handle contact form submission with validation
 */
router.post('/', contactValidation, handleContactSubmission);

/**
 * GET /contact/responses - Display all contact form submissions
 */
router.get('/responses', showContactResponses);

export default router;