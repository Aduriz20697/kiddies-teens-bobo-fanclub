// Admin Dashboard JavaScript
const ADMIN_PASSWORD = 'bobo2025'; // Change this password

// EmailJS Configuration - Update these with your actual EmailJS credentials
const EMAIL_CONFIG = {
    serviceId: 'service_bobo_fanclub', // Replace with your EmailJS Service ID
    templateId: 'template_welcome',    // Replace with your EmailJS Template ID
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your EmailJS Public Key
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
    if (confirm('Are you sure you want to delete this member?')) {
        let members = JSON.parse(localStorage.getItem('bobo_members')) || [];
        members.splice(index, 1);
        localStorage.setItem('bobo_members', JSON.stringify(members));
        loadMembers();
        updateStats();
    }
}

function deleteBirthday(index) {
    if (confirm('Are you sure you want to delete this birthday?')) {
        let birthdays = JSON.parse(localStorage.getItem('bobo_birthdays')) || [];
        birthdays.splice(index, 1);
        localStorage.setItem('bobo_birthdays', JSON.stringify(birthdays));
        loadBirthdays();
    }
}

function exportMembers() {
    const members = localStorage.getItem('bobo_members');
    downloadFile('bobo_members.json', members || '[]');
}

function exportBirthdays() {
    const birthdays = localStorage.getItem('bobo_birthdays');
    downloadFile('bobo_birthdays.json', birthdays || '[]');
}

function exportMembersCSV() {
    const members = JSON.parse(localStorage.getItem('bobo_members')) || [];
    let csv = 'Name,Email,School,Grade Level,Class,Parent Phone,Birthday,Payment Status,Payment Reference,Payment Method,Registration Date\n';
    
    members.forEach(member => {
        csv += `"${member.name}","${member.email}","${member.school}","${member.gradeLevel}","${member.classForm || ''}","${member.parentPhone}","${member.birthday || ''}","${member.paymentStatus || 'pending'}","${member.paymentReference || ''}","${member.paymentMethod || ''}","${member.registrationDate}"\n`;
    });
    
    downloadFile('bobo_members.csv', csv);
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
    
    const emailParams = {
        to_name: member.name,
        to_email: member.email,
        member_name: member.name,
        school_name: member.school,
        payment_reference: member.paymentReference || 'N/A',
        registration_date: member.registrationDate,
        reply_to: 'kiddiesteenswithbobo@gmail.com' // Add your reply-to email
    };
    
    console.log('Email parameters:', emailParams);
    
    // Show loading message
    const loadingMsg = alert('Sending welcome email...');
    
    emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            alert(`✅ Welcome email sent to ${member.name} (${member.email}) successfully!`);
        })
        .catch(function(error) {
            console.error('Email sending failed:', error);
            alert(`❌ Email sending failed. Error: ${error.text || error.message || 'Unknown error'}`);
            showEmailTemplate(member);
        });
}

function showEmailTemplate(member) {
    const emailContent = `
To: ${member.email}
Subject: Welcome to Kiddies Teens with Bobo Fan Club! 🎉

Dear ${member.name},

Welcome to the Kiddies Teens with Bobo Fan Club! 🎉

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
Kiddies Teens with Bobo Fan Club Team
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

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        if (confirm('This will delete all members and birthdays. Are you absolutely sure?')) {
            localStorage.removeItem('bobo_members');
            localStorage.removeItem('bobo_birthdays');
            loadData();
            alert('All data has been cleared.');
        }
    }
}