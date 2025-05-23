// components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CalendarDays, Trophy, Ticket, Info } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Horarios", path: "/", icon: <CalendarDays size={20} /> },
    { name: "Resultados", path: "/resultados", icon: <Trophy size={20} /> },
    { name: "Reservaciones", path: "/reservas", icon: <Ticket size={20} /> },
    { name: "Información", path: "/info", icon: <Info size={20} /> },
  ];

  return (
    <nav className=" hidden bg-blue-600 text-white shadow-md xs:flex justify-around items-center py-2 px-4 fixed bottom-0 w-full z-50 md:static md:bottom-auto md:top-0">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`flex flex-col items-center text-xs px-3 py-1.5 rounded ${
            location.pathname === item.path
              ? "bg-white text-blue-600"
              : "hover:bg-blue-700"
          }`}
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
