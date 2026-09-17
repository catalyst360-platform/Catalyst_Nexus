// ============================================
// FORM HANDLERS - Read Catalyst™
// ============================================

// 1️⃣ EXPERT FORM HANDLER
// ============================================
// For Expert Form
const expertForm = document.getElementById('expertForm');
if (expertForm) {
  expertForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      expertise: document.getElementById('expertise').value,
      experience: document.getElementById('experience').value,
      bio: document.getElementById('bio').value,
      website: document.getElementById('website').value,
      linkedin: document.getElementById('linkedin').value
    };

    try {
      const response = await fetch('/api/expert/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      const statusMessage = document.getElementById('statusMessage');
      
      if (data.success) {
        statusMessage.innerHTML = '✅ ' + data.message;
        expertForm.reset();
      } else {
        statusMessage.innerHTML = '❌ ' + data.error;
      }
    } catch (error) {
      document.getElementById('statusMessage').innerHTML = '❌ Error: ' + error.message;
    }
  });
}

// For Partner Form
const partnerForm = document.getElementById('partnerForm');
if (partnerForm) {
  partnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      institutionName: document.getElementById('institutionName').value,
      contactFirstName: document.getElementById('contactFirstName').value,
      contactLastName: document.getElementById('contactLastName').value,
      contactEmail: document.getElementById('contactEmail').value,
      contactPhone: document.getElementById('contactPhone').value,
      location: document.getElementById('location').value,
      students: document.getElementById('students').value,
      programs: document.getElementById('programs').value,
      affiliationCode: document.getElementById('affiliationCode').value
    };

    try {
      const response = await fetch('/api/partner/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      const statusMessage = document.getElementById('statusMessage');
      
      if (data.success) {
        statusMessage.innerHTML = '✅ ' + data.message;
        partnerForm.reset();
      } else {
        statusMessage.innerHTML = '❌ ' + data.error;
      }
    } catch (error) {
      document.getElementById('statusMessage').innerHTML = '❌ Error: ' + error.message;
    }
  });
}



// ============================================
// ACKNOWLEDGEMENT MODAL FUNCTIONS
// ============================================

function showAcknowledgement(type, formData, response) {
    const modal = document.getElementById('acknowledgementModal');
    const icon = document.getElementById('acknowledgementIcon');
    const title = document.getElementById('acknowledgementTitle');
    const message = document.getElementById('acknowledgementMessage');
    const details = document.getElementById('acknowledgementDetails');
    
    if (type === 'success') {
        icon.textContent = '✅';
        icon.style.color = '#4CAF50';
        title.textContent = 'Partnership Inquiry Submitted!';
        title.style.color = '#4CAF50';
        message.textContent = 'Thank you for your interest in partnering with Read Catalyst™. Our team will review your inquiry and contact you shortly.';
        
        // Show submitted details
        details.innerHTML = `
            <p><strong>Institution:</strong> ${formData.institutionName}</p>
            <p><strong>Contact Person:</strong> ${formData.contactFirstName} ${formData.contactLastName}</p>
            <p><strong>Email:</strong> ${formData.contactEmail}</p>
            <p><strong>Location:</strong> ${formData.location}</p>
            <p style="margin-top: 15px; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
                📧 A confirmation email has been sent to <strong>${formData.contactEmail}</strong>
            </p>
        `;
    } else {
        icon.textContent = '❌';
        icon.style.color = '#f44336';
        title.textContent = 'Submission Failed';
        title.style.color = '#f44336';
        message.textContent = response.message || 'Something went wrong. Please try again.';
        details.innerHTML = '';
    }
    
    modal.style.display = 'block';
}

function closeAcknowledgement() {
    const modal = document.getElementById('acknowledgementModal');
    modal.style.display = 'none';
}

// Close modal when clicking the X button
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAcknowledgement);
    }
    
    // Close modal when clicking outside (on backdrop)
    const modal = document.getElementById('acknowledgementModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAcknowledgement();
            }
        });
    }
});


// ============================================
// END OF FORM HANDLERS
// ============================================
