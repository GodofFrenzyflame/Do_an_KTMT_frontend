import React from 'react';
import './Footer.css';
import { FaInstagram, FaTwitter, FaGithub, FaFacebook, FaYoutube, FaTiktok, FaTumblr, FaDiscord } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-links-left">
          <ul>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Get Help</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Quick Guides</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">API Documentation</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">FAQ</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Freebies</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Website Accessibility</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Send Feedback</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-links-right">
          <ul>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">IO Status</a> <span className="status-dot"></span></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">Learn</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">IO Plus</a></li>
            <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">News</a></li>
          </ul>
        </div>

        {/* Quote Section */}
        <div className="quote-section">
          <p>"Hardware eventually fails. Software eventually works"</p>
          <span>– Michael Hartung</span>
        </div>
      </div>

      {/* Social Icons */}
      <div className="footer-bottom">
        <div className="social-icons">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href="https://web.facebook.com/groups/aclabbachkhoa?locale=vi_VN" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        <a href="https://www.youtube.com/@chipfc/featured" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
        <a href="https://www.tumblr.com" target="_blank" rel="noopener noreferrer"><FaTumblr /></a>
        <a href="https://www.discord.com" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>

        </div>

        {/* Logo */}
        <div className="footer-logo">
          <img src="/static/Bku.ico" alt="Logo" style={{ width: '100px', height: 'auto' }}/>
        </div>

        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <p>A Minority and Woman-owned Business Enterprise (M/WBE)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
