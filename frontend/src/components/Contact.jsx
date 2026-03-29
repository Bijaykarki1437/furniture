// components/Contact.js
import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <span>📍</span>
              <p>123 Design Street, Creative City, ST 12345</p>
            </div>
            <div className="contact-item">
              <span>📞</span>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-item">
              <span>✉️</span>
              <p>info@furniture.com</p>
            </div>
            <div className="contact-item">
              <span>🕒</span>
              <p>Mon-Fri: 9am - 6pm | Sat: 10am - 4pm</p>
            </div>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;