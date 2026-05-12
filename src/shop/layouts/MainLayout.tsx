import { Outlet } from "react-router";
import { Navbar } from "../pages/home/Navbar";
import { Footer } from "../pages/home/Footer";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
