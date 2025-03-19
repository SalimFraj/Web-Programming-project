// Check login state on page load
document.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn()) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('searchSection').style.display = 'block';
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('searchSection').style.display = 'none';
    }
});

localStorage.setItem('users', JSON.stringify([{ email: 'coworker@example.com', password: 'pass123', role: 'coworker' }]));
localStorage.setItem('properties', JSON.stringify([{ id: 1, address: '123 Main St', neighborhood: 'Downtown' }]));
localStorage.setItem('workspaces', JSON.stringify([{ id: 2, propertyId: 1, seatingCapacity: 10, price: 500, leaseTerm: 'month' }]));



// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password && u.role === 'coworker');
    if (user) {
        localStorage.setItem('loggedInUser', email);
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('loginError').style.display = 'none';
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('searchSection').style.display = 'none';
});

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const address = document.getElementById('address').value.toLowerCase();
    const neighborhood = document.getElementById('neighborhood').value.toLowerCase();
    const seatingCapacity = document.getElementById('seatingCapacity').value;

    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];

    // Filter properties based on address and neighborhood
    const filteredProperties = properties.filter(prop => {
        const propAddress = prop.address.toLowerCase();
        const propNeighborhood = prop.neighborhood.toLowerCase();
        return (!address || propAddress.includes(address.toLowerCase())) &&
               (!neighborhood || propNeighborhood.includes(neighborhood.toLowerCase()));
      });

    // Get property IDs from filtered properties
    const propertyIds = filteredProperties.map(prop => prop.id);

    // Filter workspaces based on property IDs and seating capacity
    const filteredWorkspaces = workspaces.filter(ws => {
        const matchingProperty = filteredProperties.find(prop => prop.id === ws.propertyId);
        return matchingProperty && (!seatingCapacity || parseInt(ws.seatingCapacity) >= parseInt(seatingCapacity));
      });

    // Display the results
    displaySearchResults(filteredWorkspaces, filteredProperties);
});

// Check if a coworker is logged in
function isLoggedIn() {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === loggedInUserEmail && u.role === 'coworker');
        return !!user;
    }
    return false;
}

// Display search results
function displaySearchResults(workspaces, properties) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    if (workspaces.length === 0) {
        resultsDiv.innerHTML = '<p>No workspaces found.</p>';
        return;
    }

    workspaces.forEach(ws => {
        const property = properties.find(p => p.id === ws.propertyId);
        if (property) {
            const card = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${property.address}</h5>
                        <p class="card-text">Neighborhood: ${property.neighborhood}</p>
                        <p class="card-text">Seating Capacity: ${ws.seatingCapacity}</p>
                        <p class="card-text">Price: $${ws.price} per ${ws.leaseTerm}</p>
                    </div>
                </div>
            `;
            resultsDiv.innerHTML += card;
        }
    });
}