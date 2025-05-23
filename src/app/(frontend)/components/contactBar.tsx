'use client';

import React from 'react';
import Link from 'next/link';

const ContactBar = () => {
  return (
    <div className="bg-emerald-600 text-white flex items-center justify-between p-4">
      {/* Company Logo and Name */}
      <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
        <img
          src="/logo.png"
          alt="Company Logo"
          className="h-8 md:h-12"
        />
        <span className="text-xl font-bold">Global Shipping</span>
      </Link>

      {/* WhatsApp Contact */}
      <div>
        <a
          href="https://wa.me/233540883880?text=Hello%20Global%20Shipping%2C%20I%20need%20assistance."
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-lg hover:underline"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default ContactBar;
