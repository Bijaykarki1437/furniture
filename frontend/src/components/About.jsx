// components/About.js
import React from 'react';

function About() {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          Welcome to Furniture, where we believe that great design should be accessible to everyone. 
          Since 2010, we've been crafting beautiful, functional furniture that transforms houses into homes.
        </p>
        <p>
          Our team of skilled designers and craftsmen work tirelessly to create pieces that combine 
          contemporary aesthetics with timeless durability. Every piece is carefully constructed using 
          sustainable materials and traditional techniques.
        </p>
        <p>
          We're committed to providing our customers with not just furniture, but solutions that enhance 
          their daily lives. From cozy armchairs to elegant dining sets, each item is designed with 
          both style and comfort in mind.
        </p>
      </div>
      
      <div className="about-image">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd0b2e9c6b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Our Workshop"
        />
      </div>
    </section>
  );
}

export default About;