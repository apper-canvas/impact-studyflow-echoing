import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Grades from "@/components/pages/Grades";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerAction, setHeaderAction] = useState(null);

  const routes = [
    { path: "/", element: Dashboard, title: "Dashboard" },
    { 
      path: "/courses", 
      element: Courses, 
      title: "My Courses",
      action: { label: "Add Course", onClick: null }
    },
    { 
      path: "/assignments", 
      element: Assignments, 
      title: "Assignments",
      action: { label: "Add Assignment", onClick: null }
    },
    { path: "/calendar", element: Calendar, title: "Calendar" },
    { path: "/grades", element: Grades, title: "Grades" }
  ];

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Routes>
            {routes.map(({ path, element: Element, title, action }) => (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <Header
                      title={title}
                      action={action ? { ...action, onClick: headerAction } : null}
                      onMenuClick={() => setSidebarOpen(true)}
                    />
                    <main className="flex-1 p-4 lg:p-8">
                      <Element onAddClick={action ? setHeaderAction : null} />
                    </main>
                  </>
                }
              />
            ))}
          </Routes>
        </div>
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
    </BrowserRouter>
  );
}

export default App;