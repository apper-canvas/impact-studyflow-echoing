import { useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerAction, setHeaderAction] = useState(null);
  const matches = useMatches();
  
  // Get current route metadata
  const currentRoute = matches[matches.length - 1];
  const { title, action } = currentRoute?.handle || {};

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          title={title}
          action={action ? { ...action, onClick: headerAction } : null}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet context={{ onAddClick: setHeaderAction }} />
        </main>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}