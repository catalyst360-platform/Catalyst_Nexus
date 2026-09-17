const Joi = require('joi');

const expertApplicationSchema = Joi.object({
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
    expertise: Joi.string().trim().required().messages({
        'string.empty': 'Expertise area is required',
        'any.required': 'Expertise area is required',
    }),
    experience: Joi.number().min(0).max(70).required().messages({
        'number.min': 'Experience must be 0 or more years',
        'number.max': 'Experience cannot exceed 70 years',
        'any.required': 'Experience is required',
    }),
    bio: Joi.string().trim().max(500).optional(),
    website: Joi.string().uri().optional().allow(''),
    linkedIn: Joi.string().uri().optional().allow(''),
});

const validateExpertApplication = (data) => {
    return expertApplicationSchema.validate(data, { abortEarly: false });
};

module.exports = { validateExpertApplication };
