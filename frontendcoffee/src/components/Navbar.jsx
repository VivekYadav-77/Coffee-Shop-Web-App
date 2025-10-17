
import  { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Coffee, ShoppingCart, User, LogOut, Menu, X, Package, Truck, BarChart3, Utensils, History,Ticket ,Award} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../redux/slices/userSlice.js';
import { authApi } from '../utils/api.js';
import { clearCart } from '../redux/slices/cartSlice.js';

const Navbar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { totalQuantity } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

       return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/");
        authApi.logout();
        setIsProfileOpen(false);
        setIsMenuOpen(false);
    };

    const isActiveLink = (path) => location.pathname === path;

    // Reusable NavLink component
    const NavLink = ({ to, icon, children, isAuthRequired = false }) => {
        const active = isActiveLink(to);
        
        const handleClick = (e) => {
            if (isAuthRequired && !isAuthenticated) {
                e.preventDefault();
                alert('You need to be logged in to access this page.');
                navigate('/login');
            }
            setIsMenuOpen(false);
        };

        return (
            <Link
                to={to}
                onClick={handleClick}
                className={`flex items-center gap-2 px-6 py-2 rounded-full border text-sm font-medium transition-all duration-300
                    ${active 
                        ? 'bg-red-400/20 border-red-400/30 text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-red-400/10 hover:text-white hover:-translate-y-0.5'
                    }`}
            >
                {icon}
                <span>{children}</span>
            </Link>
        );
    };
    
    const getInitials = (name = '') => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };
    
    const navContainerClass = isScrolled
        ? 'py-4 bg-slate-900/50 backdrop-blur-xl shadow-2xl'
        : 'py-6 bg-transparent';

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${navContainerClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <Coffee size={36} className="text-red-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 [filter:drop-shadow(0_0_10px_theme(colors.red.400/0.5))]" />
                    <span className="text-2xl font-bold text-white tracking-wider">The Roasting House</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-4">
                    <NavLink to="/" icon={<User size={16}/>}>Home</NavLink>
                    {user?.role === "CUSTOMER" && <NavLink to="/my-orders" icon={<History size={16} />} isAuthRequired={true}>My Orders</NavLink>}
                     {user?.role === "CUSTOMER" && <NavLink to="/productsearch" icon={<Coffee size={16}/>} isAuthRequired={true}>Search Item</NavLink>}
                    {user?.role === "ADMIN" && <NavLink to="/admin" icon={<Package size={16} />} isAuthRequired={true}>Live Orders</NavLink>}
                    {user?.role === "ADMIN" && <NavLink to="/menumanagement" icon={<Utensils size={16} />} isAuthRequired={true}>Menu</NavLink>}
                    {user?.role === "ADMIN" && <NavLink to="/admin/analytic" icon={<BarChart3 size={16} />} isAuthRequired={true}>Analytics</NavLink>}
                    {user?.role === "ADMIN" && <NavLink to="/admin/history" icon={<History size={16} />} isAuthRequired={true}>History</NavLink>}
                    {user?.role === "AGENT" && <NavLink to="/agent" icon={<Truck size={16} />} isAuthRequired={true}>Dashboard</NavLink>}
                      {user?.role === "CUSTOMER" && <NavLink to="/award" icon={<Award size={16}/>} isAuthRequired={true}>Award</NavLink>}
                    {user?.role === "CUSTOMER" && (
                        <Link to="/cart" className="relative p-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-red-400/10 hover:text-white transition-colors">
                            <ShoppingCart size={20} />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>
                    )}
                    
                    {isAuthenticated ? (
                        <div className="relative" ref={profileRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-400"
                            >
                                {getInitials(user?.name)}
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="absolute top-full right-0 mt-3 w-72 bg-slate-800/80 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl z-50"
                                    >
                                        <div className="p-4">
                                            <p className="font-bold text-white text-md truncate">{user?.name}</p>
                                            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                                        </div>
                                        <div className="h-px bg-white/10"></div>
                                        <div className="p-2">
                                            <button 
                                                onClick={handleLogout} 
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10"
                                            >   
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                             <NavLink to="/mycoupons"  icon = {<Ticket size={16}/>}>MY Coupons</NavLink>
                                             <br></br>
                                            <NavLink to="/profile">Update Profile</NavLink>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <NavLink to="/login" icon={<User size={16}/>}>Sign In</NavLink>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button className="lg:hidden text-white z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-0 right-0 h-screen w-full max-w-xs bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 lg:hidden"
                    >
                        <nav className="flex flex-col items-center justify-center h-full gap-6 p-8">
                            <NavLink to="/" icon={<User size={16}/>}>Home</NavLink>
                            
                            {user?.role === "CUSTOMER" && <NavLink to="/my-orders" icon={<History size={16} />} isAuthRequired={true}>My Orders</NavLink>}
                             {user?.role === "CUSTOMER" && <NavLink to="/award" icon={<Award size={16}/>} isAuthRequired={true}>Award</NavLink>}
                            {user?.role === "CUSTOMER" && <NavLink to="/cart" icon={<ShoppingCart size={16}/>}>Cart ({totalQuantity})</NavLink>}
                            
                            {user?.role === "ADMIN" && <NavLink to="/admin" icon={<Package size={16} />} isAuthRequired={true}>Live Orders</NavLink>}
                            {user?.role === "ADMIN" && <NavLink to="/menumanagement" icon={<Utensils size={16} />} isAuthRequired={true}>Menu</NavLink>}
                            {user?.role === "ADMIN" && <NavLink to="/admin/analytic" icon={<BarChart3 size={16} />} isAuthRequired={true}>Analytics</NavLink>}
                            {user?.role === "ADMIN" && <NavLink to="/admin/history" icon={<History size={16} />} isAuthRequired={true}>History</NavLink>}

                            {user?.role === "AGENT" && <NavLink to="/agent" icon={<Truck size={16} />} isAuthRequired={true}>Dashboard</NavLink>}

                            <div className="w-full h-px bg-white/10 my-4"></div>

                            {isAuthenticated ? (
                                <div className='text-center'>
                                    <p className='text-white font-bold mb-4'>{user?.name}</p>
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-2 text-red-400">
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                 </div>
                            ) : (
                                <NavLink to="/login" icon={<User size={16}/>}>Sign In</NavLink>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
