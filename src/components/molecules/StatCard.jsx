import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, gradient, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <ApperIcon name={icon} className="text-white" size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span className={`text-sm font-medium ${trend > 0 ? "text-success" : "text-error"}`}>
                {trend > 0 ? "+" : ""}{trend}%
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;