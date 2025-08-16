'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Send,
  Heart,
  Sparkles,
  Eye,
  Users,
  Star,
  ChevronUp,
  ArrowRight
} from 'lucide-react';

// Import your colors (assuming same structure as navbar)
import colors from '@/constants/colors';

interface FooterLink {
  title: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerSections: FooterSection[] = [
    {
      title: 'Shop',
      links: [
        { title: 'Sunglasses', href: '/products?category=men&type=sunglasses' },
        { title: 'Eyeglasses', href: '/products?category=men&type=eyeglasses' },
        { title: 'Computer Glasses', href: '/products?category=men&type=computer glasses' },
        {title: 'Eye Glasses', href: '/products?category=men&type=eye glasses'}
      ]
    },
    {
      title: 'Support',
      links: [
        { title: 'Contact Us', href: '/contact' },
        { title: 'Size Guide', href: '/size-guide' },
        { title: 'Returns & Exchanges', href: '/refund' },
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Shipping Policy', href: '/shipping' },
        { title: 'Refund Policy', href: '/refund' },
      ]
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', href: '/about' },
        { title: 'Our Story', href: '/story' },
        { title: 'Careers', href: '/careers' },
        { title: 'Press', href: '/press' },
        { title: 'Reviews', href: '/reviews' },
        { title: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { title: 'Size Guide', href: '/size-guide' },
        { title: 'Refund Policy', href: '/refund' },
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Contact Us', href: '/contact' },
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Returns & Exchanges', href: '/refund' },
        { title: 'Shipping Policy', href: '/shipping' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600', bg: 'hover:bg-blue-50' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500', bg: 'hover:bg-sky-50' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600', bg: 'hover:bg-pink-50' },
    { name: 'Youtube', icon: Youtube, href: '#', color: 'hover:text-red-600', bg: 'hover:bg-red-50' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700', bg: 'hover:bg-blue-50' }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-dark {
          backdrop-filter: blur(20px);
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .gradient-text {
          background: #FFFFFF;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-border {
          background: #FFFFFF;
          padding: 2px;
          border-radius: 1rem;
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .social-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .social-hover:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .newsletter-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        
        .floating-shapes::before {
          content: '';
          position: absolute;
          top: 10%;
          left: 10%;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-shapes::after {
          content: '';
          position: absolute;
          bottom: 20%;
          right: 15%;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, ${colors.accent}20, ${colors.primary}20);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float 8s ease-in-out infinite reverse;
        }
      `}</style>

      <footer className="relative bg-primary text-white overflow-hidden">
        {/* Floating Background Shapes */}
        <div className="floating-shapes absolute inset-0 pointer-events-none"></div>
        
        {/* Main Footer Content */}
        <div className="relative z-10">
          {/* Features Section */}

          {/* Newsletter Section */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    <span className="gradient-text">Stay in Focus</span>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Get exclusive access to new collections, special offers, and eye care tips delivered to your inbox
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 text-white placeholder-white"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover-lift flex items-center justify-center space-x-2 ${
                        isSubscribed 
                          ? 'newsletter-success' 
                          : 'bg-background hover:from-blue-600 hover:to-purple-600 text-text'
                      }`}
                    >
                      {isSubscribed ? (
                        <>
                          <Heart size={20} />
                          <span>Subscribed!</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <span>Subscribe</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 flex justify-center space-x-6">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className={`social-hover p-4 rounded-2xl glass-effect ${social.bg} ${social.color} group`}
                      onMouseEnter={() => setHoveredSocial(social.name)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <social.icon 
                        size={24} 
                        className={`transition-all duration-300 ${
                          hoveredSocial === social.name ? 'animate-pulse-custom' : ''
                        }`} 
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                {footerSections.map((section, sectionIndex) => (
                  <div 
                    key={section.title}
                    className={`animate-slideInLeft`}
                    style={{ animationDelay: `${sectionIndex * 200}ms` }}
                  >
                    <h3 className="text-lg font-bold mb-6 text-white flex items-center space-x-2">
                      <span>{section.title}</span>
                      <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium flex items-center space-x-2 hover:translate-x-2 group"
                          >
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span>{link.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="glass-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                {/* Logo and Copyright */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                  <div className="flex items-center space-x-3 group animate-slideInLeft">
                    <div className="relative">
                      <div className="text-2xl font-black gradient-text tracking-tight">
                        EYERIC
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Sparkles 
                          size={14} 
                          className="text-yellow-400 animate-float" 
                        />
                      </div>
                    </div>
                    <Eye size={24} className="text-blue-400 animate-pulse-custom" />
                  </div>
                  
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-400">
                      © 2024 EYERIC. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Crafted with <Heart size={12} className="inline text-red-400 animate-pulse-custom" /> for better vision
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8 animate-slideInRight">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">50K+</div>
                    <div className="text-xs text-gray-400 flex items-center space-x-1">
                      <Users size={12} />
                      <span>Happy Customers</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">4.9</div>
                    <div className="text-xs text-gray-400 flex items-center space-x-1">
                      <Star size={12} />
                      <span>Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 animate-glow hover-lift"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </footer>
    </>
  );
};

export default Footer;