document.addEventListener('DOMContentLoaded', () => {
 const featuredWorkspaces = [
    {
      image: 'https://content.instantoffices.com/sc/Prod/images/centres/1600width/79151/79151-570326.jpg',
      title: 'Modern Office in Downtown',
      description: 'Spacious office with natural light, perfect for small teams.'
    },
    {
      image: 'https://images.squarespace-cdn.com/content/v1/5cf7c6c7384f410001191e39/1584728792172-YL6LSLTJFSGAP1X66MM9/IMG_9500.JPG',
      title: 'Cozy Desk Space',
      description: 'Quiet and comfortable desk in a shared office environment.'
    },
    {
      image: 'https://assets.iwgplc.com/image/upload/c_fill,f_auto,q_auto,w_327,h_245/CentreImagery/414/414_3.jpg',
      title: 'Meeting Room with Amenities',
      description: 'Fully equipped meeting room for up to 10 people.'
    }
  ];
  const grid = document.querySelector('.workspace-grid');
  featuredWorkspaces.forEach(workspace => {
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
const testimonials = [
    { quote: 'This platform made it so easy to find a workspace that fits my needs. Highly recommend!', author: 'Jane Doe, Freelancer' },
    { quote: 'Listing my property was straightforward, and I’ve already had several bookings.', author: 'John Smith, Property Owner' }
  ];
  const testimonialSection = document.querySelector('.testimonials');
  if (testimonialSection) {
    testimonials.forEach(testimonial => {
      const div = document.createElement('div');
      div.className = 'mb-3';
      div.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">"${testimonial.quote}"</p>
          <footer class="blockquote-footer">${testimonial.author}</footer>
        </blockquote>
      `;
      testimonialSection.appendChild(div);
    });
  } else {
    console.error('Testimonials section not found in the DOM');
  }
});
