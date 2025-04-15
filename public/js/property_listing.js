document.addEventListener('DOMContentLoaded', async () => {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) {
        alert('Please log in as an owner to access this page.');
        window.location.href = 'search_login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/users?email=${loggedInUserEmail}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
        }
        const users = await response.json();
        const user = Array.isArray(users) ? users[0] : users;
        if (!user || user.role.toLowerCase() !== 'owner') {
            alert('You do not have permission to view this page.');
            window.location.href = 'search_login.html';
            return;
        }
    } catch (error) {
        console.error('Error verifying user:', error.message);
        alert(`An error occurred: ${error.message}. Please try logging in again.`);
        window.location.href = 'search_login.html';
    }
});
// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');
    window.location.href = 'search_login.html';
});

// Handle property form submission
document.getElementById('propertyForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const address = document.getElementById('address').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const sqft = document.getElementById('sqft').value;
    const garage = document.getElementById('garage').value;
    const publicTransport = document.getElementById('publicTransport').value;
    const ownerEmail = localStorage.getItem('loggedInUser');

    

    // Create property object (no id, as the backend will generate it)
    const property = {
        address,
        neighborhood,
        sqft,
        garage,
        publicTransport,
        ownerEmail
    };

    try {
        // Send property data to the backend API
        const response = await fetch('http://localhost:3000/api/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(property)
        });

        if (response.ok) {
            alert('Property added successfully!');
            document.getElementById('propertyForm').reset();
            window.location.href = 'owner_dashboard.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to add property'}`);
        }
    } catch (error) {
        console.error('Error adding property:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});