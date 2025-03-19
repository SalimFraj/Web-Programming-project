document.getElementById('workspaceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const seatingCapacity = document.getElementById('seatingCapacity').value;
    const availabilityDate = document.getElementById('availabilityDate').value;
    const leaseTerm = document.getElementById('leaseTerm').value;
    const price = document.getElementById('price').value;

    // Create workspace object
    const workspace = {
        id: Date.now(), // Unique ID for workspace
        propertyId: parseInt(propertyId),
        seatingCapacity,
        availabilityDate,
        leaseTerm,
        price
    };

    // Store in localStorage
    let workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
    workspaces.push(workspace);
    localStorage.setItem('workspaces', JSON.stringify(workspaces));

    // Provide feedback
    alert('Workspace added successfully!');

    // Reset form
    document.getElementById('workspaceForm').reset();
});