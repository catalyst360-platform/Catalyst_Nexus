const mailgun = require('mailgun.js');
const FormData = require('form-data');

exports.applyAsExpert = async (req, res) => {
  try {
    const { name, email, phone, expertise, experience, bio, website, linkedin } = req.body;

    console.log('\n🔵 ════════════════════════════════════════');
    console.log('📋 [EXPERT APPLY] Request received');
    console.log('🔵 ════════════════════════════════════════\n');
    
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
    console.log('📥 [REQUEST DATA] Expert Application Details:');
    console.log('   Name:', name);
    console.log('   Email:', email);
    console.log('   Phone:', phone);
    console.log('   Expertise:', expertise);
    console.log('   Experience:', experience, 'years\n');

    // Validate required fields
    if (!email || !name || !phone || !expertise || !experience) {
      console.log('❌ [VALIDATION] Failed: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Email, name, phone, expertise, and experience are required'
      });
    }

    console.log('✅ [VALIDATION] All required fields present\n');

    const domain = process.env.MAILGUN_DOMAIN;

    // Email to expert (confirmation)
    const expertEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: email,
      subject: '✅ Expert Application Received - Read Catalyst',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you for applying!</h2>
          <p>Hi ${name},</p>
          <p>We've received your expert application. Our team will review it and contact you within <strong>2-3 business days</strong>.</p>
          
          <h3 style="color: #34495e; margin-top: 20px;">Application Details:</h3>
          <ul>
            <li><strong>Expertise:</strong> ${expertise}</li>
            <li><strong>Experience:</strong> ${experience} years</li>
            ${bio ? `<li><strong>Bio:</strong> ${bio}</li>` : ''}
            ${website ? `<li><strong>Website:</strong> ${website}</li>` : ''}
            ${linkedin ? `<li><strong>LinkedIn:</strong> ${linkedin}</li>` : ''}
          </ul>

          <p style="margin-top: 20px; color: #7f8c8d;">Best regards,<br><strong>Read Catalyst™ Team</strong></p>
        </div>
      `
    };

    // Email to admin (notification)
    const adminEmailData = {
      from: `Read Catalyst <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🆕 NEW EXPERT APPLICATION: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">New Expert Application Received</h2>
          
          <h3>Contact Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
          </ul>

          <h3>Professional Details:</h3>
          <ul>
            <li><strong>Expertise:</strong> ${expertise}</li>
            <li><strong>Experience:</strong> ${experience} years</li>
            ${bio ? `<li><strong>Bio:</strong> ${bio}</li>` : ''}
            ${website ? `<li><strong>Website:</strong> ${website}</li>` : ''}
            ${linkedin ? `<li><strong>LinkedIn:</strong> ${linkedin}</li>` : ''}
          </ul>

          <p style="margin-top: 20px; color: #7f8c8d;">Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      `
    };

    console.log('📧 [EMAIL] Sending expert confirmation email...');
    await client.messages.create(domain, expertEmailData);
    console.log(`✅ [EMAIL] Expert confirmation sent to ${email}\n`);

    console.log('📧 [EMAIL] Sending admin notification email...');
    await client.messages.create(domain, adminEmailData);
    console.log(`✅ [EMAIL] Admin notification sent to ${process.env.ADMIN_EMAIL}\n`);

    console.log('🎉 [SUCCESS] Expert application processed successfully\n');
    
    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('❌ [ERROR] Expert form error:', error.message);
    console.error('📋 Full error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message
    });
  }
};
