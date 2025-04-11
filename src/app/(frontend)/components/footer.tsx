'use client'; // Client component

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-emerald-600 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Support</h3>
            <p className="text-lg">Need help? We’re here for you.</p>

            {/* Email */}
            <a
              href="mailto:support@globalshipping.com"
              className="text-lg text-emerald-100 hover:text-white transition duration-300 block"
            >
              support@globalshipping.com
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/233540883880?text=Hello%2C%20I%20need%20support%20with%20a%20shipment."
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-emerald-100 hover:text-white transition duration-300 block"
            >
              Chat with us on WhatsApp
            </a>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-lg text-emerald-100 hover:text-white transition duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/terms" className="text-lg text-emerald-100 hover:text-white transition duration-300">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-lg text-emerald-100 hover:text-white transition duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-100 hover:text-white transition duration-300"
              >
                <i className="fab fa-facebook-f text-2xl"></i>
              </a>
              <a
                href="https://twitter.com/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-100 hover:text-white transition duration-300"
              >
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a
                href="https://linkedin.com/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-100 hover:text-white transition duration-300"
              >
                <i className="fab fa-linkedin-in text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-8">
          <p className="text-sm text-emerald-100">
            &copy; {new Date().getFullYear()} Global Shipping. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
