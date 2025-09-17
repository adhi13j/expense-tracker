import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navLinks = [
  { path: "/", name: "Home" },
  { path: "/analytics", name: "Analytics" },
  { path: "/settings", name: "Settings" },
];

function Navbar() {
  const [activeLink, setActiveLink] = useState("/");

  return (
    <nav className="relative flex items-center justify-center p-1 bg-slate-200 dark:bg-slate-800 rounded-full">
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={() => setActiveLink(link.path)}
          className={({ isActive }) =>
            `relative z-10 block w-28 text-center px-4 py-2 rounded-full text-sm font-semibold transition-colors
            ${
              isActive
                ? "text-white" 
                : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100" // Inactive text color
            }`
          }
        >
          {link.name}
          {link.path === activeLink && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 bg-indigo-600 rounded-full"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navbar;
