// components/Hero.js
import React from 'react';

function Hero() {
  const scrollToProducts = () => {
    document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Modern Furniture for Modern Living</h1>
        <p>Discover our collection of contemporary furniture designed to transform your space</p>
        <button className="cta-button" onClick={scrollToProducts}>
          Shop Now
        </button>
      </div>
    </section>
  );
}

export default Hero;