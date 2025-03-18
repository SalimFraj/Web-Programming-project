// Fetch and display featured workspaces
fetch('/api/featured-workspaces')
    .then(response => response.json())
    .then(data => {
        const grid = document.querySelector('.workspace-grid');
        data.forEach(workspace => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card mb-4">
                    <img src="${workspace.image}" class="card-img-top" alt="${workspace.title}">
                    <div class="card-body">
                        <h5 class="card-title">${workspace.title}</h5>
                        <p class="card-text">${workspace.description}</p>
                    </div>
                </div>
            `;
            grid.appendChild(col);
        });
    })
    .catch(error => console.error('Error fetching workspaces:', error));

// Fetch and display testimonials
fetch('/api/testimonials')
    .then(response => response.json())
    .then(data => {
        const testimonialsSection = document.querySelector('.testimonials');
        data.forEach(testimonial => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            div.innerHTML = `
                <blockquote class="blockquote">
                    <p class="mb-0">"${testimonial.quote}"</p>
                    <footer class="blockquote-footer">${testimonial.author}</footer>
                </blockquote>
            `;
            testimonialsSection.appendChild(div);
        });
    })
    .catch(error => console.error('Error fetching testimonials:', error));