import { Coffee,CupSodaIcon} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
const Footer = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <CupSodaIcon className="h-8 w-8 text-amber-500" />
              <span className="text-xl font-bold">The Roasting House</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Crafting the perfect cup of coffee since 2025. We source the
              finest beans from around the world and roast them to perfection,
              bringing you an exceptional coffee experience.
            </p>
           
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/team"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/Contactform"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact us
                </Link>
              </li>
             
            </ul>
          </div>
        </div>
        {/*admin previlage*/}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} The Roasting House. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
