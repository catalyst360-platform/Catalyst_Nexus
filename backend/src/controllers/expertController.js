// expertController.js - TOP OF FILE

const mailgun = require('mailgun.js');
const FormData = require('form-data');

// ✅ CORRECT WAY - Initialize inside the function or with proper format
const mg = new mailgun(FormData);

// Don't initialize client here - do it inside the function
// This ensures the key is fresh each time

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

    // ✅ FIX: Initialize client HERE with proper authentication
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
    if (!email || !name) {
      console.log('❌ [VALIDATION] Failed: Missing email or name');
      return res.status(400).json({ 
        success: false, 
        error: 'Email and name are required' 
      });
    }

    if (!process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_API_KEY) {
      console.log('❌ [CONFIG ERROR] Missing Mailgun configuration');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service not configured' 
      });
    }

    console.log('✅ [VALIDATION] All required fields present\n');

    // ===== EMAIL TO USER =====
    const userEmailData = {
      from: process.env.MAILGUN_FROM_EMAIL,
      to: email,
      subject: 'Expert Application Received - Read Catalyst',
      html: `
        <h2>Thank you for applying, ${name}!</h2>
        <p>We have received your expert application and appreciate your interest in Read Catalyst.</p>
        <p>Our team will review your profile and get back to you shortly.</p>
        <br/>
        <p>Best regards,<br/>Read Catalyst Team</p>
      `
    };

    console.log('📤 [EMAIL 1/2] Sending confirmation email to user:');
    console.log('   To:', userEmailData.to);
    console.log('   From:', userEmailData.from);
    console.log('   Domain:', process.env.MAILGUN_DOMAIN);

    try {
      const userMsg = await client.messages.create(process.env.MAILGUN_DOMAIN, userEmailData);
      console.log('✅ [SUCCESS] User email sent');
      console.log('   Message ID:', userMsg.id, '\n');
    } catch (emailError) {
      console.error('❌ [ERROR - USER EMAIL] Failed to send:');
      console.error('   Status:', emailError.status);
      console.error('   Details:', emailError.details);
      console.error('   Full Error:', emailError, '\n');
      throw emailError;
    }

    // ===== EMAIL TO ADMIN =====
    const adminEmailData = {
      from: process.env.MAILGUN_FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Expert Application: ${name}`,
      html: `
        <h2>New Expert Application Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Expertise:</strong> ${expertise}</p>
        <p><strong>Experience:</strong> ${experience} years</p>
      `
    };

    console.log('📤 [EMAIL 2/2] Sending notification email to admin:');
    console.log('   To:', adminEmailData.to);
    console.log('   From:', adminEmailData.from);

    try {
      const adminMsg = await client.messages.create(process.env.MAILGUN_DOMAIN, adminEmailData);
      console.log('✅ [SUCCESS] Admin email sent');
      console.log('   Message ID:', adminMsg.id, '\n');
    } catch (emailError) {
      console.error('❌ [ERROR - ADMIN EMAIL] Failed to send:');
      console.error('   Status:', emailError.status);
      console.error('   Details:', emailError.details, '\n');
      throw emailError;
    }

    // ===== SUCCESS RESPONSE =====
    console.log('🟢 ════════════════════════════════════════');
    console.log('✅ [SUCCESS] Both emails sent successfully');
    console.log('🟢 ════════════════════════════════════════\n');

    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully',
      data: { name, email }
    });

  } catch (error) {
    console.error('\n🔴 ════════════════════════════════════════');
    console.error('❌ [CRITICAL ERROR]', error.message);
    console.error('🔴 ════════════════════════════════════════\n');

    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
};
