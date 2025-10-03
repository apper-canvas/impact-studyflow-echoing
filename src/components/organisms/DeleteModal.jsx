import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-error to-red-600 flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="AlertTriangle" className="text-white" size={32} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {title}
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  {message}
                </p>

                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="button" variant="danger" onClick={onConfirm} className="flex-1">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;