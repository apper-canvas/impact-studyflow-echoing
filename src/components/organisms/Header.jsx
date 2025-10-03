import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, action, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {action && (
            <Button variant="primary" onClick={action.onClick}>
              <ApperIcon name="Plus" size={18} />
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;