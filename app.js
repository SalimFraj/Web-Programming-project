const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes for pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/property_listing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'property_listing.html'));
});

app.get('/workspace_listing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'workspace_listing.html'));
});

app.get('/search_login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search_login.html'));
});

// API endpoints for landing page
app.get('/api/featured-workspaces', (req, res) => {
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
  res.json(featuredWorkspaces);
});

app.get('/api/testimonials', (req, res) => {
  const testimonials = [
    {
      quote: 'This platform made it so easy to find a workspace that fits my needs. Highly recommend!',
      author: 'Jane Doe, Freelancer'
    },
    {
      quote: 'Listing my property was straightforward, and I’ve already had several bookings.',
      author: 'John Smith, Property Owner'
    }
  ];
  res.json(testimonials);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});