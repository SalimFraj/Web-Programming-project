document.getElementById('signupForm').addEventListener('submit', function(event) {
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
        password // Note: In Phase 2, this will be hashed
    };

    // Store in localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    // Note: In Phase 2, replace plain text password storage with proper hashing
    localStorage.setItem('users', JSON.stringify(users));

    // Feedback to user
    alert('Signup successful! You can now log in.');
    // Optional redirect: window.location.href = '/login';
});