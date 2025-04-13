// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedin,
// } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-400 py-10">
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
//         {/* Company Section */}
//         <div>
//           <h3 className="text-white font-semibold mb-4">Company</h3>
//           <ul className="space-y-2">
//             <li>
//               <a href="#" className="hover:text-white">
//                 About Us
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Careers
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Press
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Blog
//               </a>
//             </li>
//           </ul>
//         </div>

//         {/* Support Section */}
//         <div>
//           <h3 className="text-white font-semibold mb-4">Support</h3>
//           <ul className="space-y-2">
//             <li>
//               <a href="#" className="hover:text-white">
//                 Help Center
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Safety Center
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Community
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Trust & Safety
//               </a>
//             </li>
//           </ul>
//         </div>

//         {/* Legal Section */}
//         <div>
//           <h3 className="text-white font-semibold mb-4">Legal</h3>
//           <ul className="space-y-2">
//             <li>
//               <a href="#" className="hover:text-white">
//                 Terms of Service
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Privacy Policy
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Cookie Policy
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-white">
//                 Rental Agreement
//               </a>
//             </li>
//           </ul>
//         </div>

//         {/* Newsletter Section */}
//         <div>
//           <h3 className="text-white font-semibold mb-4">Newsletter</h3>
//           <p className="mb-4">Stay updated with our latest offers and news</p>
//           <div className="flex">
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 focus:outline-none"
//             />
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-500">
//               Subscribe
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer Bottom */}
//       <div className="border-t border-gray-700 mt-8 pt-6 text-center">
//         <p>© 2024 RentHub. All rights reserved.</p>
//         <div className="flex justify-center space-x-4 mt-4">
//           <a href="#" className="text-gray-400 hover:text-white">
//             <FaFacebookF />
//           </a>
//           <a href="#" className="text-gray-400 hover:text-white">
//             <FaTwitter />
//           </a>
//           <a href="#" className="text-gray-400 hover:text-white">
//             <FaInstagram />
//           </a>
//           <a href="#" className="text-gray-400 hover:text-white">
//             <FaLinkedin />
//           </a>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-gray-900 text-gray-400 py-10"
      aria-label="Footer Section"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white" aria-label="About Us">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white" aria-label="Careers">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white" aria-label="Press">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white" aria-label="Blog">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white" aria-label="Help Center">
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white"
                aria-label="Safety Center"
              >
                Safety Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white" aria-label="Community">
                Community
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white"
                aria-label="Trust & Safety"
              >
                Trust & Safety
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-white"
                aria-label="Terms of Service"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white"
                aria-label="Cookie Policy"
              >
                Cookie Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white"
                aria-label="Rental Agreement"
              >
                Rental Agreement
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="mb-4">Stay updated with our latest offers and news</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 focus:outline-none"
              required
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-500"
              type="submit"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center">
        <p>© 2024 RentHub. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="https://facebook.com"
            className="text-gray-400 hover:text-white"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            className="text-gray-400 hover:text-white"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            className="text-gray-400 hover:text-white"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            className="text-gray-400 hover:text-white"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
