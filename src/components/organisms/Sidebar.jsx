import React from "react";
import { useAuth } from '@/layouts/Root';
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "CheckSquare" },
    { path: "/calendar", label: "Calendar", icon: "Calendar" },
    { path: "/grades", label: "Grades", icon: "BarChart3" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              StudyFlow
            </h1>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-50",
                    isActive && "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md"
                  )
                }
>
                {({ isActive }) => (
                  <>
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200">
<button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-50 w-full"
            >
              <ApperIcon name="LogOut" size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed top-0 left-0 w-70 bg-white h-screen z-50 shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                StudyFlow
              </h1>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={24} className="text-gray-600" />
            </button>
          </div>
          
          <nav className="space-y-2">
{navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-50",
                    isActive && "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200">
<button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-50 w-full"
            >
              <ApperIcon name="LogOut" size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;