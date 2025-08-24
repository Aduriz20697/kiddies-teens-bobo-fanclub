// Photo gallery functionality
function selectPhoto(element) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const img = element.querySelector('img');
    
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalImg.alt = img.alt;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Form submission
document.getElementById('joinForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        const messageDiv = document.getElementById('message');
        
        if (response.ok) {
            messageDiv.innerHTML = `<p style="color: green;">✅ ${result.message}</p>`;
            this.reset();
        } else {
            messageDiv.innerHTML = `<p style="color: red;">❌ ${result.error}</p>`;
        }
    } catch (error) {
        document.getElementById('message').innerHTML = 
            `<p style="color: red;">❌ Connection error. Please try again.</p>`;
    }
});