// Check login state on page load
document.addEventListener('DOMContentLoaded', async function() {
    if (await isLoggedIn()) {
        const user = await getLoggedInUser();
        if (user.role === 'owner') {
            window.location.href = 'owner_dashboard.html';
        } else {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('searchSection').style.display = 'block';
        }
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('searchSection').style.display = 'none';
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await response.json();

          if (response.ok) {
            localStorage.setItem('loggedInUser', data.user.email);
            if (data.user.role === 'owner') { // Adjusted to data.user.role
                window.location.href = 'owner_dashboard.html';
            } else {
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('searchSection').style.display = 'block';
                document.getElementById('loginError').style.display = 'none';
            }
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('searchSection').style.display = 'none';
});

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const address = document.getElementById('address').value.toLowerCase();
    const neighborhood = document.getElementById('neighborhood').value.toLowerCase();
    const sqft = document.getElementById('sqft').value;
    const garage = document.getElementById('garage').value;
    const publicTransport = document.getElementById('publicTransport').value;
    const seats = document.getElementById('seats').value;
    const smoking = document.getElementById('smoking').value;
    const availability = document.getElementById('availability').value;
    const term = document.getElementById('term').value;
    const price = document.getElementById('price').value;

    try {
        // Fetch properties from the API
        const propertiesResponse = await fetch('http://localhost:3000/api/properties');
        const properties = await propertiesResponse.json();

        // Fetch workspaces from the API
        const workspacesResponse = await fetch('http://localhost:3000/api/workspaces');
        const workspaces = await workspacesResponse.json();

        // Filter properties based on property-related criteria
        const filteredProperties = properties.filter(prop => {
            const propAddress = prop.address.toLowerCase();
            const propNeighborhood = prop.neighborhood.toLowerCase();
            return (!address || propAddress.includes(address)) &&
                   (!neighborhood || propNeighborhood.includes(neighborhood)) &&
                   (!sqft || prop.sqft >= parseInt(sqft)) &&
                   (!garage || prop.garage === garage) &&
                   (!publicTransport || prop.publicTransport === publicTransport);
        });

        // Get property IDs from filtered properties
        const propertyIds = filteredProperties.map(prop => prop.id);

        // Filter workspaces based on property IDs and workspace-specific criteria
        const filteredWorkspaces = workspaces.filter(ws => {
            const matchesProperty = propertyIds.includes(ws.propertyId);
            const matchesSeats = !seats || ws.seats >= parseInt(seats);
            const matchesSmoking = !smoking || ws.smoking === smoking;
            const matchesAvailability = !availability || new Date(ws.availability) >= new Date(availability);
            const matchesTerm = !term || ws.leaseTerm === term;
            const matchesPrice = !price || ws.price <= parseFloat(price);
            return matchesProperty && matchesSeats && matchesSmoking && matchesAvailability && matchesTerm && matchesPrice;
        });

        // Display the results
        displaySearchResults(filteredWorkspaces, filteredProperties);
    } catch (error) {
        console.error('Search error:', error);
        alert('An error occurred while searching. Please try again later.');
    }
});

// Check if a user is logged in
async function isLoggedIn() {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
        try {
            const response = await fetch(`/api/users?email=${loggedInUserEmail}`);
            const user = await response.json();
            return !!user;
        } catch (error) {
            console.error('Error checking login status:', error);
            return false;
        }
    }
    return false;
}

// Get the logged-in user’s details
async function getLoggedInUser() {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
        try {
            const response = await fetch(`/api/users?email=${loggedInUserEmail}`);
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    }
    return null;
}

// Display search results with clickable titles and all relevant details
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
                        <h5 class="card-title"><a href="workspace_details.html?id=${ws._id}">${ws.type}</a></h5>
                        <p class="card-text">Address: ${property.address}</p>
                        <p class="card-text">Neighborhood: ${property.neighborhood}</p>
                        <p class="card-text">Square Footage: ${property.sqft} sqft</p>
                        <p class="card-text">Garage: ${property.garage}</p>
                        <p class="card-text">Public Transport: ${property.publicTransport}</p>
                        <p class="card-text">Seats: ${ws.seats}</p>
                        <p class="card-text">Smoking: ${ws.smoking}</p>
                        <p class="card-text">Availability: ${ws.availability}</p>
                        <p class="card-text">Lease Term: ${ws.term}</p>
                        <p class="card-text">Price: $${ws.price}</p>
                    </div>
                </div>
            `;
            resultsDiv.innerHTML += card;
        }
    });
}