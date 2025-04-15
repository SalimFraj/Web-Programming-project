document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const workspaceId = urlParams.get('id');
    if (!workspaceId) {
      alert('No workspace selected.');
      window.location.href = 'search_login.html';
      return;
    }
  
    try {
      // Fetch workspace details
      const workspaceResponse = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}`);
      if (!workspaceResponse.ok) {
        throw new Error(`Failed to fetch workspace details: ${workspaceResponse.status}`);
      }
      const workspace = await workspaceResponse.json();
  
      // Check if property and ownerEmail exist
      if (!workspace.property || !workspace.property.ownerEmail) {
        throw new Error('Property or owner email missing in workspace data');
      }
  
      // Fetch owner information
      const ownerResponse = await fetch(`http://localhost:3000/api/users?email=${workspace.property.ownerEmail}`);
      if (!ownerResponse.ok) {
        throw new Error(`Failed to fetch owner information: ${ownerResponse.status}`);
      }
      const owners = await ownerResponse.json();
      const owner = owners.length > 0 ? owners[0] : null; // Take first match or null
  
      // Display workspace details
      const workspaceInfo = document.getElementById('workspaceInfo');
      workspaceInfo.innerHTML = `
        <h5 class="card-title">${workspace.type}</h5>
        <p><strong>Seats:</strong> ${workspace.seats}</p>
        <p><strong>Smoking Allowed:</strong> ${workspace.smoking === 'yes' ? 'Yes' : 'No'}</p>
        <p><strong>Availability:</strong> ${new Date(workspace.availability).toLocaleDateString()}</p>
        <p><strong>Lease Term:</strong> ${workspace.term}</p>
        <p><strong>Price:</strong> $${workspace.price}</p>
      `;
  
      // Display owner contact
      const ownerContact = document.getElementById('ownerContact');
      if (owner) {
        ownerContact.innerHTML = `
          <h5 class="card-title">Owner Contact</h5>
          <p><strong>Email:</strong> ${owner.email}</p>
          ${owner.phone ? `<p><strong>Phone:</strong> ${owner.phone}</p>` : ''}
        `;
      } else {
        ownerContact.innerHTML = `<p>Owner contact information not available.</p>`;
      }
    } catch (error) {
      console.error('Error loading workspace details:', error);
      alert('An error occurred while loading the workspace details. Please try again later.');
      window.location.href = 'search_login.html';
    }
  });