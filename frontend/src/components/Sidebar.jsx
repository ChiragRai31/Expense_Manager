import React from "react";
import { Home, FileText, BarChart, CreditCard, Layers, Tag, ClipboardList, Calendar, RefreshCw, Smartphone, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils"; // optional helper for conditional classes

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Overview",
      icon: <Home size={18} />,
      link: "/",
    },
    {
      section: "TRANSACTION DATA",
      items: [
        { title: "Transaction Details", icon: <FileText size={18} />, link: "/transactions" },
        { title: "Statistics & Analysis", icon: <BarChart size={18} />, link: "/statistics" },
      ],
    }
  ];

  return (
    <aside className="w-64 h-screen bg-[#f9f7f3] border-r border-gray-200 flex flex-col text-sm">
      

      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
        {menuItems.map((section, idx) =>
          section.section ? (
            <div key={idx}>
              <p className="text-gray-400 text-xs font-semibold tracking-wide mb-1 mt-2">
                {section.section}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.link}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-[#f0e9e0] hover:text-[#7b4f2c] transition",
                        location.pathname === item.link ? "bg-[#f0e9e0] text-[#7b4f2c] font-medium" : ""
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div key={idx}>
              <Link
                to={section.link}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-[#f0e9e0] hover:text-[#7b4f2c] transition",
                  location.pathname === section.link ? "bg-[#f0e9e0] text-[#7b4f2c] font-medium" : ""
                )}
              >
                {section.icon}
                {section.title}
              </Link>
            </div>
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
