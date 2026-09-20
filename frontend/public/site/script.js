// ============================================
// FORM HANDLERS - Read Catalyst™
// ============================================

// 1️⃣ EXPERT FORM HANDLER
// ============================================
const expertForm = document.getElementById('expertForm');
const expertStatusMessage = document.getElementById('statusMessage');

if (expertForm) {
    expertForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            applicantType: 'expert',
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            expertise: document.getElementById('expertise').value,
            experience: document.getElementById('experience').value,
            bio: document.getElementById('bio').value,
            website: document.getElementById('website').value,
            linkedin: document.getElementById('linkedin').value
        };
        
        expertStatusMessage.textContent = '📤 Submitting...';
        expertStatusMessage.style.color = 'blue';
        
        try {
            const response = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                expertStatusMessage.textContent = '✅ Application submitted successfully! Check your email for confirmation.';
                expertStatusMessage.style.color = 'green';
                expertStatusMessage.style.fontSize = '16px';
                expertStatusMessage.style.fontWeight = 'bold';
                expertForm.reset();
            } else {
                expertStatusMessage.textContent = '❌ ' + (data.message || 'Submission failed. Please try again.');
                expertStatusMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Expert form error:', error);
            expertStatusMessage.textContent = '❌ Network error. Please check your connection and try again.';
            expertStatusMessage.style.color = 'red';
        }
    });
}

// ============================================
// PARTNER FORM HANDLER
// ============================================
// ==================== PARTNER FORM HANDLER ====================
const partnerForm = document.getElementById('partnerForm');
const partnerStatus = document.getElementById('statusMessage');

if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        partnerStatus.textContent = 'Submitting...';
        partnerStatus.style.color = '#666';
        
        const formData = new FormData(partnerForm);
        const data = Object.fromEntries(formData);
        data.applicantType = 'partner';
        data.partnerConsent = partnerForm.querySelector('#partnerConsent').checked;

        try {
            const response = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                partnerStatus.textContent = '✅ Partnership Inquiry Submitted Successfully! Check your email for confirmation.';
                partnerStatus.style.color = '#22c55e';
                partnerForm.reset();
            } else {
                partnerStatus.textContent = '❌ ' + result.message;
                partnerStatus.style.color = '#ef4444';
            }
        } catch (error) {
            console.error('Partner form error:', error);
            partnerStatus.textContent = '❌ Server error. Please try again.';
            partnerStatus.style.color = '#ef4444';
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
