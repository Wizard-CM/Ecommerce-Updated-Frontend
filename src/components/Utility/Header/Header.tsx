"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX } from "react";
import UserDropdown from "./Dropdown";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  ChevronRight,
  Menu,
  Zap,
} from "lucide-react";

export type navlinkType = {
  name: string;
  link: string;
  dropDown: any[];
  icon?: JSX.Element;
};

const navLinks: navlinkType[] = [
  {
    name: `Home`,
    link: `/`,
    dropDown: [],
    icon: <Home size={18} />,
  },
  {
    name: `Products`,
    link: `/products`,
    dropDown: [],
    icon: <ShoppingBag size={18} />,
  },
  {
    name: `Cart`,
    link: `/cart`,
    dropDown: [],
    icon: <ShoppingCart size={18} />,
  },
];

// const navLinksAccounts = [
//   {
//     name: `${t('Logout')}`,
//     link: `/${locale}/login`,
//     icon: <LogoutIcon />,
//     dropDown: [],
//   },
// ];

const Header = ({
  width = "1450px",
  padding = false,
}: {
  width?: string;
  padding?: boolean;
}) => {
  const pathname = usePathname();
  // ${pathname == link.link && `bg-theme_color text-white`}

  return (
    <div className={`mx-auto ${padding && "px-4 sm:px-6 lg:px-8"}`} style={{ maxWidth: width }}>
      <div className="flex items-center justify-between py-4 border-b  border-b-white/50">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-indigo-200">
              YourBrand
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.link}
                className={`${
                  pathname == link.link
                    ? "text-indigo-400 bg-indigo-900/30 border-b-2 border-indigo-400"
                    : "text-white hover:text-indigo-300"
                } font-medium transition-colors duration-200 flex items-center space-x-2 py-2 px-3 rounded-md`}
              >
                {link.icon}
                <span>{link.name}</span>
    
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="cursor-pointer">
            <UserDropdown />
          </div>

          <Link
            href="/products"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-indigo-500/20 group"
          >
            Get Started
            <ChevronRight
              size={18}
              className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>

          <button className="md:hidden p-2 text-gray-400 hover:text-indigo-300 transition-colors duration-200 rounded-md hover:bg-gray-800/50">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
