const mailgun = require('mailgun.js');
const FormData = require('form-data');

const mg = new mailgun(FormData);
const domain = process.env.MAILGUN_DOMAIN;

exports.applyAsPartner = async (req, res) => {
  try {
    const { institutionName, contactFirstName, contactLastName, contactEmail, contactPhone, location, students, programs } = req.body;

    console.log('\n🟢 ════════════════════════════════════════');
    console.log('📋 [PARTNER APPLY] Request received');
    console.log('🟢 ════════════════════════════════════════\n');
    
    // Validate required fields
    if (!institutionName || !contactFirstName || !contactLastName || !contactEmail || !contactPhone) {
      console.log('❌ [VALIDATION] Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Institution name, contact name, email, and phone are required'
      });
    }

    console.log('✅ Validation passed\n');

    // Email to partner
    const partnerEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: contactEmail,
      subject: '✅ Partnership Application Received - Read Catalyst',
      html: `
        <h2>Thank you for your partnership interest!</h2>
        <p>Hi ${contactFirstName} ${contactLastName},</p>
        <p>We've received your partnership application for <strong>${institutionName}</strong>. Our team will review it and contact you within 3-5 business days.</p>
        <p><strong>Application Details:</strong></p>
        <ul>
          <li><strong>Institution:</strong> ${institutionName}</li>
          <li><strong>Location:</strong> ${location || 'N/A'}</li>
          <li><strong>Students:</strong> ${students || 'N/A'}</li>
          <li><strong>Programs:</strong> ${programs || 'N/A'}</li>
        </ul>
        <p>Best regards,<br>Read Catalyst™ Team</p>
      `
    };

    // Email to admin
    const adminEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🏫 NEW PARTNER APPLICATION: ${institutionName}`,
      html: `
        <h2>New Partnership Application</h2>
        <p><strong>Institution:</strong> ${institutionName}</p>
        <p><strong>Contact:</strong> ${contactFirstName} ${contactLastName}</p>
        <p><strong>Email:</strong> ${contactEmail}</p>
        <p><strong>Phone:</strong> ${contactPhone}</p>
        <p><strong>Location:</strong> ${location || 'N/A'}</p>
        <p><strong>Students:</strong> ${students || 'N/A'}</p>
        <p><strong>Programs:</strong> ${programs || 'N/A'}</p>
      `
    };

    await mg.messages.create(domain, partnerEmailData);
    console.log(`✅ Partner confirmation sent to ${contactEmail}`);

    await mg.messages.create(domain, adminEmailData);
    console.log(`✅ Admin notification sent\n`);

    res.json({ 
      success: true, 
      message: 'Partnership application submitted successfully! Check your email for confirmation.' 
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
