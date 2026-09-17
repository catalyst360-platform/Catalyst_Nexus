const mailgun = require('mailgun.js');
const FormData = require('form-data');

const mg = new mailgun(FormData);
const domain = process.env.MAILGUN_DOMAIN;

exports.applyAsExpert = async (req, res) => {
  try {
    const { name, email, phone, expertise, experience, bio, website, linkedin } = req.body;

    console.log('\n🔵 ════════════════════════════════════════');
    console.log('📋 [EXPERT APPLY] Request received');
    console.log('🔵 ════════════════════════════════════════\n');
    
    // Validate required fields
    if (!email || !name || !phone || !expertise || !experience) {
      console.log('❌ [VALIDATION] Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Email, name, phone, expertise, and experience are required'
      });
    }

    console.log('✅ Validation passed\n');

    // Email to expert
    const expertEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: email,
      subject: '✅ Expert Application Received - Read Catalyst',
      html: `
        <h2>Thank you for applying!</h2>
        <p>Hi ${name},</p>
        <p>We've received your expert application. Our team will review it and contact you within 2-3 business days.</p>
        <p><strong>Application Details:</strong></p>
        <ul>
          <li><strong>Expertise:</strong> ${expertise}</li>
          <li><strong>Experience:</strong> ${experience} years</li>
        </ul>
        <p>Best regards,<br>Read Catalyst™ Team</p>
      `
    };

    // Email to admin
    const adminEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🆕 NEW EXPERT APPLICATION: ${name}`,
      html: `
        <h2>New Expert Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Expertise:</strong> ${expertise}</p>
        <p><strong>Experience:</strong> ${experience} years</p>
        <p><strong>Bio:</strong> ${bio || 'N/A'}</p>
        <p><strong>Website:</strong> ${website || 'N/A'}</p>
        <p><strong>LinkedIn:</strong> ${linkedin || 'N/A'}</p>
      `
    };

    await mg.messages.create(domain, expertEmailData);
    console.log(`✅ Expert confirmation sent to ${email}`);

    await mg.messages.create(domain, adminEmailData);
    console.log(`✅ Admin notification sent\n`);

    res.json({ 
      success: true, 
      message: 'Application submitted successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('❌ Expert form error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message
    });
  }
};

module.exports = { applyAsExpert };
