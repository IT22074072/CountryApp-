import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white py-8 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-lg mb-4">&copy; 2025 World Explorer. All Rights Reserved.</p>
        
        <div className="flex justify-center space-x-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-2xl hover:text-white/90 transition-colors" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-2xl hover:text-white/90 transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl hover:text-white/90 transition-colors" />
          </a>
        </div>

        <p className="mt-6 text-sm text-white/70">
          This project is developed for educational purposes. Country information is retrieved from public APIs.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
