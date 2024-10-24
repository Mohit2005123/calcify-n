import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaTelegramPlane, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Calcify</h2>
            <p className="text-sm mb-4">Professional Web Design</p>
            <p className="text-sm mb-2">
              Hi! My name is Mohit Mongia and I'm a Computer Science Engineering student. I have developed this web app to enhance user experience and provide seamless interaction. My motivation stems from a passion for technology and a desire to create impactful digital solutions.
            </p>
            {/* <p className="text-sm mb-2">
              <span className="inline-block mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Wisconsin Ave, Suite 700 Chevy Chase, Maryland 20815
            </p> */}
            <p className="text-sm mb-2">
              <span className="inline-block mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              mohitmongia2005@gmail.com
            </p>
            {/* <p className="text-sm">
              <span className="inline-block mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              +1 800 854-36-80
            </p> */}
          </div>

          {/* Question Form */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Question us</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <input
                type="text"
                placeholder="Company Name"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none">
                <option value="" disabled selected>Select your role</option>
                <option>CEO</option>
                <option>Manager</option>
                <option>Developer</option>
              </select>
              <input
                type="tel"
                placeholder="+91 800 123-34-45"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                Get started
              </button>
            </form>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-gray-600">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-gray-600">Careers</Link></li>
              <li><Link href="/faq" className="hover:text-gray-600">FAQs</Link></li>
              <li><Link href="/teams" className="hover:text-gray-600">Teams</Link></li>
              <li><Link href="/contact" className="hover:text-gray-600">Contact Us</Link></li>
            </ul>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FaTelegramPlane className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FaLinkedinIn className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
