const mailgun = require('mailgun.js');
const FormData = require('form-data');

exports.applyAsPartner = async (req, res) => {
  try {
    const { institutionName, contactFirstName, contactLastName, contactEmail, contactPhone, location, students, programs, affiliationCode } = req.body;

    console.log('\n🟢 ════════════════════════════════════════');
    console.log('📋 [PARTNER APPLY] Request received');
    console.log('🟢 ════════════════════════════════════════\n');
    
    // Check env variables
    console.log('🔑 [CONFIG CHECK] Mailgun Environment Variables:');
    console.log('   ✓ Domain:', process.env.MAILGUN_DOMAIN || '❌ NOT SET');
    console.log('   ✓ From Email:', process.env.MAILGUN_FROM_EMAIL || '❌ NOT SET');
    console.log('   ✓ API Key (first 20 chars):', 
      process.env.MAILGUN_API_KEY ? 
      process.env.MAILGUN_API_KEY.substring(0, 20) + '...' : 
      '❌ NOT SET');
    console.log('   ✓ Admin Email:', process.env.ADMIN_EMAIL || '❌ NOT SET\n');

    // Initialize Mailgun client HERE with proper authentication
    const client = mg.client({ 
      username: 'api', 
      key: process.env.MAILGUN_API_KEY 
    });

    console.log('✅ [MAILGUN] Client initialized with API key\n');

    // Log incoming request body
    console.log('📥 [REQUEST DATA] Partner Application Details:');
    console.log('   Institution:', institutionName);
    console.log('   Contact:', contactFirstName, contactLastName);
    console.log('   Email:', contactEmail);
    console.log('   Phone:', contactPhone);
    console.log('   Location:', location);
    console.log('   Students:', students);
    console.log('   Programs:', programs, '\n');

    // Validate required fields
    if (!institutionName || !contactFirstName || !contactLastName || !contactEmail || !contactPhone) {
      console.log('❌ [VALIDATION] Failed: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Institution name, contact name, email, and phone are required'
      });
    }

    console.log('✅ [VALIDATION] All required fields present\n');

    const domain = process.env.MAILGUN_DOMAIN;

    // Email to partner (confirmation)
    const partnerEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: contactEmail,
      subject: '✅ Partnership Application Received - Read Catalyst',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you for your partnership interest!</h2>
          <p>Hi ${contactFirstName} ${contactLastName},</p>
          <p>We've received your partnership application for <strong>${institutionName}</strong>. Our team will review it and contact you within <strong>3-5 business days</strong>.</p>
          
          <h3 style="color: #34495e; margin-top: 20px;">Application Details:</h3>
          <ul>
            <li><strong>Institution:</strong> ${institutionName}</li>
            ${affiliationCode ? `<li><strong>Affiliation Code:</strong> ${affiliationCode}</li>` : ''}
            ${location ? `<li><strong>Location:</strong> ${location}</li>` : ''}
            ${students ? `<li><strong>Students:</strong> ${students}</li>` : ''}
            ${programs ? `<li><strong>Programs:</strong> ${programs}</li>` : ''}
          </ul>

          <p style="margin-top: 20px; color: #7f8c8d;">Best regards,<br><strong>Read Catalyst™ Team</strong></p>
        </div>
      `
    };

    // Email to admin (notification)
    const adminEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🏫 NEW PARTNER APPLICATION: ${institutionName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">New Partnership Application Received</h2>
          
          <h3>Institution Information:</h3>
          <ul>
            <li><strong>Institution:</strong> ${institutionName}</li>
            ${affiliationCode ? `<li><strong>Affiliation Code:</strong> ${affiliationCode}</li>` : ''}
            ${location ? `<li><strong>Location:</strong> ${location}</li>` : ''}
            ${students ? `<li><strong>Students:</strong> ${students}</li>` : ''}
            ${programs ? `<li><strong>Programs:</strong> ${programs}</li>` : ''}
          </ul>

          <h3>Contact Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${contactFirstName} ${contactLastName}</li>
            <li><strong>Email:</strong> ${contactEmail}</li>
            <li><strong>Phone:</strong> ${contactPhone}</li>
          </ul>

          <p style="margin-top: 20px; color: #7f8c8d;">Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      `
    };

    console.log('📧 [EMAIL] Sending partner confirmation email...');
    await client.messages.create(domain, partnerEmailData);
    console.log(`✅ [EMAIL] Partner confirmation sent to ${contactEmail}\n`);

    console.log('📧 [EMAIL] Sending admin notification email...');
    await client.messages.create(domain, adminEmailData);
    console.log(`✅ [EMAIL] Admin notification sent to ${process.env.ADMIN_EMAIL}\n`);

    console.log('🎉 [SUCCESS] Partner application processed successfully\n');
    
    res.status(200).json({ 
      success: true, 
      message: 'Partnership application submitted successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('❌ [ERROR] Partner form error:', error.message);
    console.error('📋 Full error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message
    });
  }
};
