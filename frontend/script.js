// 🔍 DEBUG - Log all form submissions
console.log('✅ script.js loaded');
console.log('🌍 API Base URL:', window.location.origin);



console.log("script.js is running");

// Check if CSS is loaded
const cssLoaded = [...document.styleSheets].some(sheet => sheet.href && sheet.href.includes("styles.css"));
console.log("CSS loaded:", cssLoaded);

// Check if header exists
const header = document.querySelector("header");
console.log("Header element found:", !!header);

// Catch errors globally
window.addEventListener("error", (event) => {
  console.error("Global error:", event.message, "at", event.filename, ":", event.lineno);
});


// Intercept all fetch calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('📤 [FETCH]', args[0], args[1]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('📥 [RESPONSE]', response.status, response.statusText);
      return response;
    })
    .catch(error => {
      console.error('❌ [FETCH ERROR]', error);
      throw error;
    });
};


const API_URL = 'https://backend-gules-three-78.vercel.app';

// Expert Form
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
      bio: document.getElementById('bio')?.value || '',
      website: document.getElementById('website')?.value || '',
      linkedin: document.getElementById('linkedin')?.value || ''
    };

    try {
      const response = await fetch(`${API_URL}/api/expert/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      const statusMessage = document.getElementById('statusMessage');
      
      if (data.success) {
        statusMessage.innerHTML = '✅ Application submitted successfully!';
        statusMessage.style.color = 'green';
        expertForm.reset();
      } else {
        statusMessage.innerHTML = '❌ ' + (data.error || data.message);
        statusMessage.style.color = 'red';
      }
    } catch (error) {
      document.getElementById('statusMessage').innerHTML = '❌ Error: ' + error.message;
      document.getElementById('statusMessage').style.color = 'red';
    }
  });
}

// Partner Form
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
      location: document.getElementById('location')?.value || '',
      students: document.getElementById('students')?.value || '',
      programs: document.getElementById('programs')?.value || '',
      affiliationCode: document.getElementById('affiliationCode')?.value || ''
    };

    try {
      const response = await fetch(`${API_URL}/api/partner/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      const statusMessage = document.getElementById('statusMessage');
      
      if (data.success) {
        statusMessage.innerHTML = '✅ Application submitted successfully!';
        statusMessage.style.color = 'green';
        partnerForm.reset();
      } else {
        statusMessage.innerHTML = '❌ ' + (data.error || data.message);
        statusMessage.style.color = 'red';
      }
    } catch (error) {
      document.getElementById('statusMessage').innerHTML = '❌ Error: ' + error.message;
      document.getElementById('statusMessage').style.color = 'red';
    }
  });
}
