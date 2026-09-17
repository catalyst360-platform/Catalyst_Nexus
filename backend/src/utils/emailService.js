const mailgun = require('mailgun.js');
const FormData = require('form-data');

const mg = new mailgun(FormData);
const domain = process.env.MAILGUN_DOMAIN;

/**
 * Send Expert Application Confirmation Email
 */
const sendExpertConfirmation = async (expertData) => {
    try {
        const { name, email, expertise, phone } = expertData;

        const messageData = {
            from: `Read Catalyst <noreply@${domain}>`,
            to: email,
            cc: process.env.ADMIN_EMAIL,
            subject: '✨ Welcome to Read Catalyst - Expert Application Received',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">🎓 Application Received</h2>
                    
                    <p>Hi <strong>${name}</strong>,</p>
                    
                    <p>Thank you for applying as an Expert at Read Catalyst! We've received your application and are excited to review it.</p>
                    
                    <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Your Details:</strong></p>
                        <ul>
                            <li><strong>Name:</strong> ${name}</li>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Expertise:</strong> ${expertise}</li>
                            <li><strong>Phone:</strong> ${phone}</li>
                        </ul>
                    </div>
                    
                    <p>We'll review your profile and contact you within 48 hours. In the meantime, you can log in to your dashboard to track the status.</p>
                    
                    <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
                        <em>This is an automated message. Please do not reply to this email.</em>
                    </p>
                </div>
            `,
        };

        const result = await mg.messages.create(domain, messageData);
        console.log(`✅ Expert confirmation sent to ${email}`);
        return result;
    } catch (error) {
        console.error('❌ Failed to send expert confirmation:', error);
        throw new Error(`Email service error: ${error.message}`);
    }
};

/**
 * Send Instructor Application Confirmation Email
 */
const sendInstructorConfirmation = async (instructorData) => {
    try {
        const { name, email, subject, experience, qualifications } = instructorData;

        const messageData = {
            from: `Read Catalyst <noreply@${domain}>`,
            to: email,
            cc: process.env.ADMIN_EMAIL,
            subject: '📚 Welcome to Read Catalyst - Instructor Application Received',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">📚 Application Received</h2>
                    
                    <p>Hi <strong>${name}</strong>,</p>
                    
                    <p>Thank you for applying as an Instructor at Read Catalyst! We're impressed by your profile.</p>
                    
                    <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Your Details:</strong></p>
                        <ul>
                            <li><strong>Name:</strong> ${name}</li>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Subject:</strong> ${subject}</li>
                            <li><strong>Experience:</strong> ${experience} years</li>
                            <li><strong>Qualifications:</strong> ${qualifications}</li>
                        </ul>
                    </div>
                    
                    <p>Our team will review your application and reach out with next steps. This typically takes 3-5 business days.</p>
                    
                    <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
                        <em>This is an automated message. Please do not reply to this email.</em>
                    </p>
                </div>
            `,
        };

        const result = await mg.messages.create(domain, messageData);
        console.log(`✅ Instructor confirmation sent to ${email}`);
        return result;
    } catch (error) {
        console.error('❌ Failed to send instructor confirmation:', error);
        throw new Error(`Email service error: ${error.message}`);
    }
};

/**
 * Send Admin Notification
 */
const sendAdminNotification = async (type, data) => {
    try {
        const messageData = {
            from: `Read Catalyst System <system@${domain}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🔔 New ${type} Application - ${data.name}`,
            text: `New ${type} application received:\n\n${JSON.stringify(data, null, 2)}`,
        };

        await mg.messages.create(domain, messageData);
        console.log(`✅ Admin notification sent for ${type} application`);
    } catch (error) {
        console.error('❌ Failed to send admin notification:', error);
    }
};

module.exports = {
    sendExpertConfirmation,
    sendInstructorConfirmation,
    sendAdminNotification,
};
