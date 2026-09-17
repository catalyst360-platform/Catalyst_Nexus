const Joi = require('joi');

const instructorApplicationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required',
    }),
    phone: Joi.string()
        .pattern(/^[0-9+\-\s()]{10,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please enter a valid phone number',
            'any.required': 'Phone is required',
        }),
    subject: Joi.string().trim().required().messages({
        'string.empty': 'Subject is required',
        'any.required': 'Subject is required',
    }),
    experience: Joi.number().min(0).max(70).required().messages({
        'number.min': 'Experience must be 0 or more years',
        'number.max': 'Experience cannot exceed 70 years',
        'any.required': 'Experience is required',
    }),
    qualifications: Joi.string().trim().required().messages({
        'string.empty': 'Qualifications are required',
        'any.required': 'Qualifications are required',
    }),
    teachingApproach: Joi.string().trim().max(500).optional(),
    certifications: Joi.string().trim().optional(),
});

const validateInstructorApplication = (data) => {
    return instructorApplicationSchema.validate(data, { abortEarly: false });
};

module.exports = { validateInstructorApplication };
