const FormData = require('form-data');
const Mailgun = require('mailgun.js');

// ✅ CORRECT INITIALIZATION - Same as expert
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

const domain = process.env.MAILGUN_DOMAIN;

const applyAsPartner = async (req, res) => {
    try {
        const {
            institutionName,
            institutionType,
            location,
            students,
            programs,
            contactFirstName,
            contactLastName,
            contactRole,
            contactEmail,
            contactPhone,
            challenges,
            aspirations,
            timeline,
            budget,
            partnerConsent
        } = req.body;

        if (!institutionName || !contactEmail || !contactFirstName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const partnerEmailData = {
            from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
            to: contactEmail,
            subject: '🎓 Partnership Inquiry Received - Read Catalyst™',
            html: `
                <h2>Hello ${contactFirstName}!</h2>
                <p>Thank you for your interest in partnering with <strong>Read Catalyst™</strong>.</p>
                <p>We received your inquiry for <strong>${institutionName}</strong> in <strong>${location}</strong>.</p>
                <p>Our team will be in touch within 2-3 business days.</p>
                <p>Best regards,<br><strong>Read Catalyst™ Team</strong></p>
            `
        };

        const adminEmailData = {
            from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🏢 NEW PARTNER INQUIRY: ${institutionName}`,
            html: `
                <h2>New Partnership Inquiry</h2>
                <p><strong>Institution:</strong> ${institutionName}</p>
                <p><strong>Contact:</strong> ${contactFirstName} ${contactLastName}</p>
                <p><strong>Email:</strong> ${contactEmail}</p>
                <p><strong>Phone:</strong> ${contactPhone}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Students:</strong> ${students}</p>
                <p><strong>Programs:</strong> ${programs}</p>
            `
        };

        await mg.messages.create(domain, partnerEmailData);
        console.log(`✅ Partner confirmation sent to ${contactEmail}`);

        await mg.messages.create(domain, adminEmailData);
        console.log(`✅ Admin notification sent`);

        res.json({ 
            success: true, 
            message: 'Partnership inquiry submitted successfully!' 
        });

    } catch (error) {
        console.error('❌ Partner form error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message
        });
    }
};

module.exports = { applyAsPartner };
