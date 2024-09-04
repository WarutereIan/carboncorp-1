import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login.tsx";
import DashboardHOC from "./HOCs/DashboardHOC";
import Geography from "./pages/Geography.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardHOC />,
  },
  {
    path: "/geography",
    element: (
      <DashboardHOC>
        <Geography />
      </DashboardHOC>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-center" />
    <RouterProvider router={router} />
  </StrictMode>
);
