document.addEventListener('DOMContentLoaded', async () => {
    const ownerEmail = localStorage.getItem('loggedInUser');
    console.log('Owner Email:', ownerEmail);
    if (!ownerEmail) {
        window.location.href = 'search_login.html';
        return;
    }

    try {
        // Fetch owner's properties from the API
        const propertiesResponse = await fetch(`http://localhost:3000/api/properties?ownerEmail=${ownerEmail}`);
        if (!propertiesResponse.ok) {
            const errorText = await propertiesResponse.text();
            throw new Error(`Failed to fetch properties: ${propertiesResponse.status} - ${errorText}`);        }
        const ownerProperties = await propertiesResponse.json();
        console.log('Owner Properties:', ownerProperties);

        // Fetch all workspaces from the API
        const workspacesResponse = await fetch('http://localhost:3000/api/workspaces');
        if (!workspacesResponse.ok) {
            throw new Error('Failed to fetch workspaces');
        }
        const workspaces = await workspacesResponse.json();

        const propertiesList = document.getElementById('properties-list');
        ownerProperties.forEach(property => {
            const propertyDiv = document.createElement('div');
            propertyDiv.className = 'card mb-3';
            propertyDiv.innerHTML = `
                <div class="card-body">
                    <h5>${property.address}</h5>
                    <dl class="row">
                        <dt class="col-sm-3">Neighborhood</dt>
                        <dd class="col-sm-9">${property.neighborhood}</dd>
                        <dt class="col-sm-3">Sqft</dt>
                        <dd class="col-sm-9">${property.sqft}</dd>
                        <dt class="col-sm-3">Garage</dt>
                        <dd class="col-sm-9">${property.garage}</dd>
                        <dt class="col-sm-3">Public Transport</dt>
                        <dd class="col-sm-9">${property.publicTransport}</dd>
                    </dl>
                    <button class="btn btn-warning edit-property" data-id="${property._id}">Edit</button>
                    <button class="btn btn-danger delete-property" data-id="${property._id}">Delete</button>
                    <h6>Workspaces:</h6>
                    <div id="workspaces-${property._id}" class="row"></div>
                    <button class="btn btn-success add-workspace" data-id="${property._id}">Add Workspace</button>
                </div>
            `;
            propertiesList.appendChild(propertyDiv);
        
            const workspaceContainer = document.getElementById(`workspaces-${property._id}`);
            // Corrected filter: use w.property._id to match property._id
            const propertyWorkspaces = workspaces.filter(w => w.property && w.property._id === property._id);            
            propertyWorkspaces.forEach(workspace => {
                let iconClass;
                switch (workspace.type) {
                    case 'meeting_room':
                        iconClass = 'fa-users';
                        break;
                    case 'private_office':
                        iconClass = 'fa-briefcase';
                        break;
                    case 'open_desk':
                        iconClass = 'fa-laptop';
                        break;
                    default:
                        iconClass = 'fa-question';
                }
        
                const smokingBadge = workspace.smoking === 'yes' 
                    ? '<span class="badge badge-success">Smoking Allowed</span>' 
                    : '<span class="badge badge-danger">No Smoking</span>';
        
                const workspaceItem = document.createElement('div');
                workspaceItem.className = 'col-md-4';
                workspaceItem.innerHTML = `
                    <div class="workspace-card card mb-2">
                        <div class="card-header">
                            <i class="fa ${iconClass}"></i> ${workspace.type}
                        </div>
                        <div class="card-body">
                            <p>Seats: ${workspace.seats}</p>
                            <p>Smoking: ${smokingBadge}</p>
                            <p>Availability: ${workspace.availability}</p>
                            <p>Term: ${workspace.term}</p>
                            <p>Price: $${workspace.price}</p>
                            <button class="btn btn-sm btn-warning edit-workspace" data-id="${workspace._id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-workspace" data-id="${workspace._id}">Delete</button>
                        </div>
                    </div>
                `;
                workspaceContainer.appendChild(workspaceItem);
            });
        });

        // Attach event listeners for buttons
        document.querySelectorAll('.edit-property').forEach(btn => {
            btn.addEventListener('click', () => {
              const propertyId = btn.dataset.id;
              console.log('Edit button clicked, propertyId:', propertyId); // Debug log
              if (!propertyId) {
                alert('Property ID is undefined. Please check the data.');
                return;
              }
              editProperty(propertyId);
            });
          });
        document.querySelectorAll('.delete-property').forEach(btn => {
            btn.addEventListener('click', () => deleteProperty(btn.dataset.id));
        });
        document.querySelectorAll('.add-workspace').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('propertyId').value = this.dataset.id;
                $('#addWorkspaceModal').modal('show');
            });
        });
        document.querySelectorAll('.edit-workspace').forEach(btn => {
            btn.addEventListener('click', () => {
              const workspaceId = btn.dataset.id;
              console.log('Editing workspace with ID:', workspaceId); // Debug line
              editWorkspace(workspaceId);
            });
          });
          
          document.querySelectorAll('.delete-workspace').forEach(btn => {
            btn.addEventListener('click', () => {
              const workspaceId = btn.dataset.id;
              console.log('Deleting workspace with ID:', workspaceId); // Debug line
              deleteWorkspace(workspaceId);
            });
          });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('An error occurred while loading the dashboard: ${error.message}. Please try again later.');
    }
});

// Handle add workspace form submission
document.getElementById('addWorkspaceForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const propertyId = document.getElementById('propertyId').value;
    if (!propertyId) {
        alert('Property ID is missing. Cannot add workspace.');
        return;
    }
    const type = document.getElementById('workspaceType').value;
    const seats = document.getElementById('seats').value;
    const smoking = document.getElementById('smoking').value;
    const availability = document.getElementById('availability').value;
    const term = document.getElementById('term').value;
    const price = document.getElementById('price').value;
    const ownerEmail = localStorage.getItem('loggedInUser');

    const workspace = {
        property: propertyId, 
        type,
        seats,
        smoking,
        availability,
        term,
        price,
        ownerEmail
    };

    try {
        const response = await fetch('http://localhost:3000/api/workspaces', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workspace)
        });

        if (response.ok) {
            alert('Workspace added successfully!');
            $('#addWorkspaceModal').modal('hide');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to add workspace'}`);
        }
    } catch (error) {
        console.error('Error adding workspace:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});

// Handle edit workspace form submission
document.getElementById('edit-workspace-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const workspaceId = document.getElementById('edit-workspace-id').value;
    const type = document.getElementById('edit-workspace-type').value;
    const seats = document.getElementById('edit-workspace-seats').value;
    const smoking = document.getElementById('edit-workspace-smoking').value;
    const availability = document.getElementById('edit-workspace-availability').value;
    const term = document.getElementById('edit-workspace-term').value;
    const price = document.getElementById('edit-workspace-price').value;

    const updatedWorkspace = {
        type,
        seats,
        smoking,
        availability,
        term,
        price
    };

    try {
        const response = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedWorkspace)
        });

        if (response.ok) {
            alert('Workspace updated successfully!');
            $('#editWorkspaceModal').modal('hide');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to update workspace'}`);
        }
    } catch (error) {
        console.error('Error updating workspace:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});

// Handle edit property form submission
document.getElementById('edit-property-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const propertyId = document.getElementById('edit-property-id').value;
    const address = document.getElementById('edit-property-address').value;
    const neighborhood = document.getElementById('edit-property-neighborhood').value;
    const sqft = document.getElementById('edit-property-sqft').value;
    const garage = document.getElementById('edit-property-garage').value;
    const publicTransport = document.getElementById('edit-property-publicTransport').value;

    const updatedProperty = {
        address,
        neighborhood,
        sqft,
        garage,
        publicTransport
    };

    try {
        const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProperty)
        });

        if (response.ok) {
            alert('Property updated successfully!');
            $('#editPropertyModal').modal('hide');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to update property'}`);
        }
    } catch (error) {
        console.error('Error updating property:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});

async function editProperty(propertyId) {
    console.log('Fetching property with ID:', propertyId);
    if (!propertyId) {
        alert('Property ID is undefined. Cannot fetch property details.');
        return;
      }
    try {
      const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
      console.log('Response status:', response.status); 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch property: ${response.status} - ${errorText}`);
      }
      const property = await response.json();
      console.log('Fetched property:', property); 
      document.getElementById('edit-property-id').value = property._id;
      document.getElementById('edit-property-address').value = property.address;
      document.getElementById('edit-property-neighborhood').value = property.neighborhood;
      document.getElementById('edit-property-sqft').value = property.sqft;
      document.getElementById('edit-property-garage').value = property.garage;
      document.getElementById('edit-property-publicTransport').value = property.publicTransport;
      $('#editPropertyModal').modal('show');
    } catch (error) {
      console.error('Error fetching property:', error);
      alert(`An error occurred while fetching property details: ${error.message}`);
    }
  }

async function deleteProperty(propertyId) {
    if (!confirm('Are you sure? This will delete all associated workspaces.')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Property and associated workspaces deleted successfully!');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to delete property'}`);
        }
    } catch (error) {
        console.error('Error deleting property:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
}
async function editWorkspace(workspaceId) {
    console.log('Opening edit modal for workspace ID:', workspaceId);
    try {
        const response = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}`);
        console.log('Fetch status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch workspace');
        const workspace = await response.json();
        console.log('Workspace data:', workspace);

        const idField = document.getElementById('edit-workspace-id');
        if (!idField) {
            console.error('Input element edit-workspace-id not found in DOM');
            alert('Form configuration error: ID field missing.');
            return;
        }
        idField.value = workspace._id;
        console.log('Set edit-workspace-id to:', idField.value);

        document.getElementById('edit-workspace-type').value = workspace.type;
        document.getElementById('edit-workspace-seats').value = workspace.seats;
        document.getElementById('edit-workspace-smoking').value = workspace.smoking;
        document.getElementById('edit-workspace-availability').value = workspace.availability;
        document.getElementById('edit-workspace-term').value = workspace.term;
        document.getElementById('edit-workspace-price').value = workspace.price;

        $('#editWorkspaceModal').modal('show');
    } catch (error) {
        console.error('Error fetching workspace:', error);
        alert('Failed to load workspace details.');
    }
}

async function deleteWorkspace(workspaceId) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Workspace deleted successfully!');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to delete workspace'}`);
        }
    } catch (error) {
        console.error('Error deleting workspace:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
}

document.getElementById('logoutBtn').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');
    window.location.href = 'search_login.html';
});