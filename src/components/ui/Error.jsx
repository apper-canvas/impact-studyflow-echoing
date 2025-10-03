import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-error to-red-600 flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name="AlertCircle" className="text-white" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops!</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;