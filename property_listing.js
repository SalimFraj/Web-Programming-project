document.getElementById('propertyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const address = document.getElementById('address').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const squareFootage = document.getElementById('squareFootage').value;
    const parking = document.getElementById('parking').value;
    const publicTransport = document.getElementById('publicTransport').value;

    // Create property object
    const property = {
        id: Date.now(),
        address,
        neighborhood,
        squareFootage,
        parking,
        publicTransport
    };

    // Simulate storing data locally in localStorage
    let properties = JSON.parse(localStorage.getItem('properties')) || [];
    properties.push(property);
    localStorage.setItem('properties', JSON.stringify(properties));

    // Provide feedback to the user
    alert('Property added successfully!');

    // Clear form fields
    document.getElementById('propertyForm').reset();
});