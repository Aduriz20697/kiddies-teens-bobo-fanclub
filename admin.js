// Admin Dashboard JavaScript
const ADMIN_PASSWORD = 'bobo2025'; // Change this password

// EmailJS Configuration - Update these with your actual EmailJS credentials
const EMAIL_CONFIG = {
    serviceId: 'service_p7r1e54', // Replace with your EmailJS Service ID
    templateId: 'template_vj6a8ps',    // Replace with your EmailJS Template ID
    publicKey: 'RDRFzaV66z2Y4V_3d' // Replace with your EmailJS Public Key
};

// Initialize EmailJS when page loads
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('EmailJS initialized successfully');
        return true;
    } else {
        console.log('EmailJS not configured or not loaded');
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
    
    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            alert('Incorrect password!');
        }
    });
    
    loadData();
});

function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    loadData();
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Show selected section
    document.getElementById(section + 'Section').style.display = 'block';
    event.target.classList.add('active');
}

function loadData() {
    loadMembers();
    loadBirthdays();
    updateStats();
}

function loadMembers() {
    const members = JSON.parse(localStorage.getItem('bobo_members')) || [];
    const tbody = document.querySelector('#membersTable tbody');
    tbody.innerHTML = '';
    
    members.forEach((member, index) => {
        const paymentStatus = member.paymentStatus || 'pending';
        const statusClass = paymentStatus === 'verified' ? 'status-verified' : 'status-pending';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.school}</td>
            <td>${member.gradeLevel}</td>
            <td><span class="${statusClass}">${paymentStatus}</span></td>
            <td>${member.paymentReference || 'N/A'}</td>
            <td>${member.paymentMethod || 'N/A'}</td>
            <td>${member.registrationDate}</td>
            <td>
                <button onclick="togglePaymentStatus(${index})" class="verify-btn">Toggle Status</button>
                <button onclick="deleteMember(${index})" class="delete-btn">Delete</button>
            </td>
        `;
    });
}

function loadBirthdays() {
    const birthdays = JSON.parse(localStorage.getItem('bobo_birthdays')) || [];
    const tbody = document.querySelector('#birthdaysTable tbody');
    tbody.innerHTML = '';
    
    birthdays.forEach((birthday, index) => {
        const birthDate = new Date(birthday.birthday);
        const monthName = birthDate.toLocaleString('default', { month: 'long' });
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${birthday.name}</td>
            <td>${birthday.birthday}</td>
            <td>${birthday.age}</td>
            <td>${monthName}</td>
            <td><button onclick="deleteBirthday(${index})" class="delete-btn">Delete</button></td>
        `;
    });
}

function updateStats() {
    const members = JSON.parse(localStorage.getItem('bobo_members')) || [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyMembers = members.filter(member => {
        const regDate = new Date(member.registrationDate);
        return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    });
    
    const verifiedPayments = members.filter(member => member.paymentStatus === 'verified').length;
    const pendingPayments = members.filter(member => member.paymentStatus !== 'verified').length;
    
    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('monthlyMembers').textContent = monthlyMembers.length;
    document.getElementById('verifiedPayments').textContent = verifiedPayments;
    document.getElementById('pendingPayments').textContent = pendingPayments;
}

function deleteMember(index) {
    const members = JSON.parse(localStorage.getItem('bobo_members')) || [];
    const member = members[index];
    
    showDeleteConfirmation(
        'Delete Member',
        `Are you sure you want to permanently delete this member?\n\nMember: ${member.name}\nEmail: ${member.email}\nSchool: ${member.school}\n\nThis action cannot be undone.`,
        () => {
            members.splice(index, 1);
            localStorage.setItem('bobo_members', JSON.stringify(members));
            loadMembers();
            updateStats();
            showProfessionalNotification(
                'Member Deleted',
                `Member "${member.name}" has been successfully removed from the system.`,
                'success'
            );
        }
    );
}

function deleteBirthday(index) {
    const birthdays = JSON.parse(localStorage.getItem('bobo_birthdays')) || [];
    const birthday = birthdays[index];
    
    showDeleteConfirmation(
        'Delete Birthday Record',
        `Are you sure you want to delete this birthday record?\n\nName: ${birthday.name}\nBirthday: ${birthday.birthday}\nAge: ${birthday.age}\n\nThis action cannot be undone.`,
        () => {
            birthdays.splice(index, 1);
            localStorage.setItem('bobo_birthdays', JSON.stringify(birthdays));
            loadBirthdays();
            showProfessionalNotification(
                'Birthday Record Deleted',
                `Birthday record for "${birthday.name}" has been successfully removed.`,
                'success'
            );
        }
    );
}



function exportMembersCSV() {
    const members = JSON.parse(localStorage.getItem('bobo_members')) || [];
    let csv = 'Name,Email,School,Grade Level,Class,Parent Phone,Birthday,Payment Status,Payment Reference,Payment Method,Registration Date\n';
    
    members.forEach(member => {
        csv += `"${member.name}","${member.email}","${member.school}","${member.gradeLevel}","${member.classForm || ''}","${member.parentPhone}","${member.birthday || ''}","${member.paymentStatus || 'pending'}","${member.paymentReference || ''}","${member.paymentMethod || ''}","${member.registrationDate}"\n`;
    });
    
    downloadFile('bobo_members.csv', csv);
}

function exportBirthdaysCSV() {
    const birthdays = JSON.parse(localStorage.getItem('bobo_birthdays')) || [];
    let csv = 'Name,Birthday,Age,Month\n';
    
    birthdays.forEach(birthday => {
        const birthDate = new Date(birthday.birthday);
        const monthName = birthDate.toLocaleString('default', { month: 'long' });
        csv += `"${birthday.name}","${birthday.birthday}","${birthday.age}","${monthName}"\n`;
    });
    
    downloadFile('bobo_birthdays.csv', csv);
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function togglePaymentStatus(index) {
    let members = JSON.parse(localStorage.getItem('bobo_members')) || [];
    const member = members[index];
    const newStatus = member.paymentStatus === 'verified' ? 'pending' : 'verified';
    
    members[index].paymentStatus = newStatus;
    localStorage.setItem('bobo_members', JSON.stringify(members));
    
    // Send welcome email if payment is verified
    if (newStatus === 'verified') {
        sendWelcomeEmail(member);
    }
    
    loadMembers();
    updateStats();
}

function sendWelcomeEmail(member) {
    console.log('Attempting to send email to:', member.email);
    
    // Check if EmailJS is properly configured
    if (!initializeEmailJS()) {
        console.log('EmailJS not configured, showing template');
        showEmailTemplate(member);
        return;
    }
    
    // Validate email address
    if (!member.email || !member.email.includes('@')) {
        this.showProfessionalNotification(
            'Invalid Email Address',
            `Cannot send welcome email\nMember: ${member.name}\nEmail: ${member.email || 'Not provided'}\n\nPayment verified but please update member's email address.`,
            'error'
        );
        showEmailTemplate(member);
        return;
    }
    
    const emailParams = {
        to_name: member.name,
        to_email: member.email,
        member_name: member.name,
        school_name: member.school || 'N/A',
        payment_reference: member.paymentReference || 'N/A',
        registration_date: member.registrationDate,
        from_name: 'Kiddies Teen Fan Club with Bobo',
        reply_to: 'kiddiesteenswithbobo@gmail.com'
    };
    
    console.log('Email parameters:', emailParams);
    
    // Show professional loading notification
    const loadingNotification = this.showLoadingNotification(
        'Processing Payment Verification',
        `Sending welcome email to ${member.name}...`,
        member
    );
    
    emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            loadingNotification.remove();
            showProfessionalNotification(
                'Payment Verification Complete',
                `Member: ${member.name}\nEmail: ${member.email}\nStatus: Welcome email sent successfully\nMembership activated`,
                'success'
            );
        })
        .catch(function(error) {
            console.error('Email sending failed:', error);
            loadingNotification.remove();
            
            // Specific error handling for Gmail API issues
            let errorTitle = 'Email Delivery Issue';
            let errorMessage = `Member: ${member.name}\nPayment verified but email failed to send\n`;
            
            if (error.text && error.text.includes('insufficient authentication scopes')) {
                errorTitle = 'Gmail API Configuration Error';
                errorMessage += `Error: Gmail API authentication scope issue\n`;
                errorMessage += `Technical Details: ${error.text}\n\n`;
            } else {
                errorMessage += `Error: ${error.text || error.message || 'Unknown error'}\n\n`;
            }
            
            errorMessage += `Membership is still activated. Please contact member manually.`;
            
            showProfessionalNotification(errorTitle, errorMessage, 'warning');
            showEmailTemplate(member);
        });
}

function showEmailTemplate(member) {
    const emailContent = `
To: ${member.email}
Subject: Welcome to Kiddies Teens with Bobo Fan Club! 🎉

Dear ${member.name},

Welcome to the Kiddies Teen Fan Club with Bobo! 🎉

We are thrilled to have you as part of our amazing community. Your payment has been received and verified.

📋 Membership Details:
• Name: ${member.name}
• School: ${member.school}
• Payment Reference: ${member.paymentReference}
• Registration Date: ${member.registrationDate}

🎁 As a verified member, you now have access to:
• All fan club activities and events
• Educational programs and workshops
• Birthday celebrations and shout-outs
• Exclusive member benefits
• Holiday clinic vocational training

Thank you for joining our community! We look forward to seeing you at our upcoming events.

Best regards,
Kiddies Teen Fan Club with Bobo Team
📞 +234 818 363 0819
📍 Lasustech Student Activities, Ikorodu, Lagos State
    `;
    
    // Create modal to show email template
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 1000; display: flex;
        align-items: center; justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 600px; max-height: 80%; overflow-y: auto;">
            <h3>Email Template for ${member.name}</h3>
            <textarea style="width: 100%; height: 400px; margin: 1rem 0; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;" readonly>${emailContent}</textarea>
            <div style="text-align: center;">
                <button onclick="copyToClipboard('${emailContent.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')" style="margin: 0.5rem; padding: 1rem 2rem; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Copy Email</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="margin: 0.5rem; padding: 1rem 2rem; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Email template copied to clipboard!');
    });
}

function testEmailSystem() {
    const testEmail = prompt('Enter test email address:');
    if (!testEmail) return;
    
    const testMember = {
        name: 'Test Member',
        email: testEmail,
        school: 'Test School',
        paymentReference: 'TEST123456',
        registrationDate: new Date().toISOString().split('T')[0]
    };
    
    sendWelcomeEmail(testMember);
}

function showLoadingNotification(title, message, member) {
    const modal = document.createElement('div');
    modal.className = 'loading-notification-modal';
    
    modal.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-content">
                <div class="loading-header">
                    <div class="loading-spinner"></div>
                    <h3>${title}</h3>
                </div>
                <div class="loading-body">
                    <div class="member-info">
                        <div class="info-row">
                            <span class="label">Member:</span>
                            <span class="value">${member.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span>
                            <span class="value">${member.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Status:</span>
                            <span class="value status-processing">${message}</span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 10001; display: flex;
        align-items: center; justify-content: center;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay { background: white; border-radius: 15px; max-width: 450px; width: 90%; box-shadow: 0 15px 35px rgba(0,0,0,0.3); }
        .loading-header { padding: 2rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 15px 15px 0 0; display: flex; align-items: center; gap: 1rem; }
        .loading-spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-header h3 { margin: 0; font-size: 1.3rem; font-weight: 600; }
        .loading-body { padding: 2rem; }
        .member-info { margin-bottom: 1.5rem; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
        .label { font-weight: 600; color: #666; }
        .value { color: #333; }
        .status-processing { color: #667eea; font-weight: 600; }
        .progress-bar { width: 100%; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 3px; animation: progress 2s ease-in-out infinite; }
        @keyframes progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    return modal;
}

function showProfessionalNotification(title, message, type) {
    // Create professional modal notification
    const modal = document.createElement('div');
    modal.className = 'professional-notification-modal';
    
    const typeIcons = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️'
    };
    
    const typeColors = {
        success: '#667eea',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    modal.innerHTML = `
        <div class="notification-overlay">
            <div class="notification-content">
                <div class="notification-header" style="background: ${typeColors[type] || '#17a2b8'}">
                    <span class="notification-icon">${typeIcons[type] || 'ℹ️'}</span>
                    <h3>${title}</h3>
                </div>
                <div class="notification-body">
                    <pre>${message}</pre>
                </div>
                <div class="notification-footer">
                    <button onclick="this.closest('.professional-notification-modal').remove()" class="notification-btn">
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.7); z-index: 10000; display: flex;
        align-items: center; justify-content: center;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification-overlay { background: white; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .notification-header { padding: 1.5rem; color: white; border-radius: 10px 10px 0 0; display: flex; align-items: center; gap: 1rem; }
        .notification-icon { font-size: 1.5rem; }
        .notification-header h3 { margin: 0; font-size: 1.2rem; }
        .notification-body { padding: 2rem; }
        .notification-body pre { white-space: pre-wrap; font-family: inherit; margin: 0; line-height: 1.5; color: #333; }
        .notification-footer { padding: 1rem 2rem 2rem; text-align: right; }
        .notification-btn { background: #007bff; color: white; border: none; padding: 0.8rem 2rem; border-radius: 5px; cursor: pointer; font-weight: 600; }
        .notification-btn:hover { background: #0056b3; }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Auto-remove after 10 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            if (modal.parentNode) modal.remove();
        }, 10000);
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        if (confirm('This will delete all members and birthdays. Are you absolutely sure?')) {
            localStorage.removeItem('bobo_members');
            localStorage.removeItem('bobo_birthdays');
            loadData();
            showProfessionalNotification(
                'Data Cleared Successfully',
                'All member and birthday data has been permanently deleted from the system.\n\nDatabase Status: Empty\nAction: Complete',
                'success'
            );
        }
    }
}
function showDeleteConfirmation(title, message, onConfirm, isDangerous = false) {
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    
    const headerColor = isDangerous ? '#dc3545' : '#667eea';
    const confirmColor = isDangerous ? '#dc3545' : '#667eea';
    
    modal.innerHTML = `
        <div class="delete-overlay">
            <div class="delete-content">
                <div class="delete-header" style="background: ${headerColor}">
                    <span class="delete-icon">🗑️</span>
                    <h3>${title}</h3>
                </div>
                <div class="delete-body">
                    <pre>${message}</pre>
                </div>
                <div class="delete-footer">
                    <button onclick="this.closest('.delete-confirmation-modal').remove()" class="cancel-btn">
                        Cancel
                    </button>
                    <button onclick="confirmDelete(this)" class="confirm-btn" style="background: ${confirmColor}">
                        ${isDangerous ? 'DELETE ALL DATA' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
        align-items: center; justify-content: center;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .delete-overlay { background: white; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
        .delete-header { padding: 1.5rem; color: white; border-radius: 12px 12px 0 0; display: flex; align-items: center; gap: 1rem; }
        .delete-icon { font-size: 1.5rem; }
        .delete-header h3 { margin: 0; font-size: 1.3rem; font-weight: 600; }
        .delete-body { padding: 2rem; }
        .delete-body pre { white-space: pre-wrap; font-family: inherit; margin: 0; line-height: 1.6; color: #333; }
        .delete-footer { padding: 1rem 2rem 2rem; display: flex; gap: 1rem; justify-content: flex-end; }
        .cancel-btn, .confirm-btn { border: none; padding: 0.8rem 2rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; }
        .cancel-btn { background: #6c757d; color: white; }
        .cancel-btn:hover { background: #545b62; }
        .confirm-btn { color: white; }
        .confirm-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(102,126,234,0.3); }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    modal.confirmCallback = onConfirm;
}

function confirmDelete(button) {
    const modal = button.closest('.delete-confirmation-modal');
    if (modal && modal.confirmCallback) {
        modal.confirmCallback();
        modal.remove();
    }
}