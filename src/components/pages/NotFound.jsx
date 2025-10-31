import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg">
          <ApperIcon name="AlertCircle" className="text-white" size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Button onClick={() => navigate("/")} variant="primary" size="lg">
          <ApperIcon name="Home" size={20} />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;