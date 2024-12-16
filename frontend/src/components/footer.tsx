'use client';

import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-2xl font-bold text-white">ExcursionMate</h1>
          <p className="text-sm mt-2 text-gray-400">
            Explore amazing places with ExcursionMate, your ultimate travel
            companion.
          </p>
        </div>

        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-right">
          <h2 className="text-lg font-semibold text-white mb-4">Follow Us</h2>
          <div className="flex justify-center md:justify-end gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-200 hover:text-white transition"
            >
              <Facebook fontSize="large" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-200 hover:text-white transition"
            >
              <Twitter fontSize="large" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-200 hover:text-white transition"
            >
              <Instagram fontSize="large" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} ExcursionMate. All rights reserved.
      </div>
    </footer>
  );
}
