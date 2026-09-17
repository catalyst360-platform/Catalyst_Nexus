const { validateInstructorApplication } = require('../validators/instructorValidator');
const { sendInstructorConfirmation, sendAdminNotification } = require('../utils/emailService');

/**
 * Submit Instructor Application
 */
const submitInstructorApplication = async (req, res) => {
    try {
        // ✅ Validate input
        const { error, value } = validateInstructorApplication(req.body);

        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.path[0]] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ success: false, errors });
        }

        // ✅ Send confirmation email to instructor
        await sendInstructorConfirmation(value);

        // ✅ Send notification to admin
        await sendAdminNotification('Instructor', value);

        // ✅ TODO: Save to database
        // await Instructor.create(value);

        res.status(201).json({
            success: true,
            message: '✅ Application submitted successfully! Check your email for confirmation.',
            data: {
                name: value.name,
                email: value.email,
            },
        });
    } catch (error) {
        console.error('❌ Instructor application error:', error);
        res.status(500).json({
            success: false,
            error: '❌ Failed to submit application. Please try again.',
            message: error.message,
        });
    }
};

module.exports = { submitInstructorApplication };
