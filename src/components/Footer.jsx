import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Y-Ultimate Management. All Rights Reserved.</p>
        <p>Built for the Hackathon.</p>
      </div>
    </footer>
  );
};

export default Footer;
