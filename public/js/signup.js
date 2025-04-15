document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent page reload

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    if (!name || !phone || !email || !role || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Create user object
    const user = {
        name,
        phone,
        email,
        role,
        password // Password will be hashed on the server
    };

    try {
        // Send POST request to the API
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            // Success: Show message and redirect to login
            alert('Signup successful! You can now log in.');
            window.location.href = 'search_login.html';
        } else {
            // Error: Display the error message from the server
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        // Network or other unexpected errors
        alert('An unexpected error occurred. Please try again later.');
        console.error('Signup error:', error);
    }
});