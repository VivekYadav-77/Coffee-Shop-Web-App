import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "../pages/ChatBot";
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};
export default MainLayout;