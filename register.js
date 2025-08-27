// Registration form handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('message');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const memberData = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            school: formData.get('school_name'),
            gradeLevel: formData.get('grade_level'),
            classForm: formData.get('class_form'),
            parentPhone: formData.get('parent_phone'),
            birthday: formData.get('birthday'),
            paymentReference: formData.get('payment_reference'),
            paymentMethod: formData.get('payment_method'),
            paymentStatus: 'pending',
            registrationDate: new Date().toISOString().split('T')[0]
        };
        
        // Save to localStorage
        let members = JSON.parse(localStorage.getItem('bobo_members')) || [];
        members.push(memberData);
        localStorage.setItem('bobo_members', JSON.stringify(members));
        
        // Add birthday to birthday database if provided
        if (memberData.birthday) {
            const age = new Date().getFullYear() - new Date(memberData.birthday).getFullYear();
            let birthdays = JSON.parse(localStorage.getItem('bobo_birthdays')) || [];
            birthdays.push({
                id: memberData.id,
                name: memberData.name,
                birthday: memberData.birthday,
                age: age
            });
            localStorage.setItem('bobo_birthdays', JSON.stringify(birthdays));
        }
        
        // Show success message
        messageDiv.innerHTML = `
            <div class="success-message">
                🎉 Welcome to the Kiddies Teen Fan Club with Bobo, ${memberData.name}!
                <br>Your registration has been submitted successfully.
                <br><strong>Payment Reference:</strong> ${memberData.paymentReference}
                <br><strong>Payment Method:</strong> ${memberData.paymentMethod}
                <br><em>Your membership will be activated once payment is verified.</em>
                <br><a href="index.html">Return to Home Page</a>
            </div>
        `;
        
        // Reset form
        form.reset();
    });
    
    // School registration form handler
    const schoolForm = document.getElementById('schoolRegistrationForm');
    const schoolMessageDiv = document.getElementById('schoolMessage');
    
    schoolForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(schoolForm);
        const gradeLevels = Array.from(schoolForm.querySelectorAll('input[name="grade_levels"]:checked')).map(cb => cb.value);
        
        const schoolData = {
            id: Date.now(),
            type: 'school',
            schoolName: formData.get('school_name'),
            schoolAddress: formData.get('school_address'),
            principalName: formData.get('principal_name'),
            contactPerson: formData.get('contact_person'),
            contactEmail: formData.get('contact_email'),
            contactPhone: formData.get('contact_phone'),
            studentCount: parseInt(formData.get('student_count')),
            gradeLevels: gradeLevels,
            totalAmount: parseInt(formData.get('student_count')) * 1500,
            paymentReference: formData.get('payment_reference'),
            paymentMethod: formData.get('payment_method'),
            paymentStatus: 'pending',
            registrationDate: new Date().toISOString().split('T')[0]
        };
        
        // Save to localStorage
        let schools = JSON.parse(localStorage.getItem('bobo_schools')) || [];
        schools.push(schoolData);
        localStorage.setItem('bobo_schools', JSON.stringify(schools));
        
        // Show success message
        schoolMessageDiv.innerHTML = `
            <div class="success-message">
                🎉 ${schoolData.schoolName} has been registered with Kiddies Teen Fan Club with Bobo successfully!
                <br><strong>Students:</strong> ${schoolData.studentCount}
                <br><strong>Total Amount:</strong> ₦${schoolData.totalAmount.toLocaleString()}
                <br><strong>Payment Reference:</strong> ${schoolData.paymentReference}
                <br><em>School membership will be activated once payment is verified.</em>
                <br><a href="index.html">Return to Home Page</a>
            </div>
        `;
        
        // Reset form
        schoolForm.reset();
        updateTotalAmount();
    });
    
    // Update total amount when student count changes
    document.getElementById('student_count').addEventListener('input', updateTotalAmount);
});

// Tab switching function
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    if (tabName === 'individual') {
        document.getElementById('registrationForm').classList.add('active');
        document.querySelector('.tab-btn').classList.add('active');
    } else {
        document.getElementById('schoolRegistrationForm').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

// Update total amount for school registration
function updateTotalAmount() {
    const studentCount = document.getElementById('student_count').value || 0;
    const total = studentCount * 1500;
    document.getElementById('totalAmount').textContent = `Total Amount: ₦${total.toLocaleString()}`;
}

// File upload display functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('payment_evidence');
    const fileName = document.querySelector('.file-name');
    
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileName.textContent = this.files[0].name;
                fileName.style.color = '#28a745';
                fileName.style.fontStyle = 'normal';
            } else {
                fileName.textContent = 'No file selected';
                fileName.style.color = '#6c757d';
                fileName.style.fontStyle = 'italic';
            }
        });
    }
});