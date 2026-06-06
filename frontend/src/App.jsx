import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Navbar          from "@/components/Navbar";
import Footer          from "@/components/Footer";
import ScrollToTop     from "@/components/ScrollToTop";
import AdPopup         from "@/components/AdPopup";
import ProtectedRoute  from "@/components/ProtectedRoute";
import { Toaster }     from "sonner";

import Home            from "@/pages/Home";
import Login           from "@/pages/Login";
import Register        from "@/pages/Register";
import Browse          from "@/pages/Browse";
import BookDetail      from "@/pages/BookDetail";
import ListBook        from "@/pages/ListBook";
import Donate          from "@/pages/Donate";
import Wall            from "@/pages/Wall";
import Chat            from "@/pages/Chat";
import Dashboard       from "@/pages/Dashboard";
import PriceCalculator from "@/pages/PriceCalculator";
import About           from "@/pages/About";
import Developer       from "@/pages/Developer";
import Ads             from "@/pages/Ads";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"                 element={<Home />} />
              <Route path="/login"            element={<Login />} />
              <Route path="/register"         element={<Register />} />
              <Route path="/browse"           element={<Browse />} />
              <Route path="/books/:id"        element={<BookDetail />} />
              <Route path="/list-book"        element={<ProtectedRoute><ListBook /></ProtectedRoute>} />
              <Route path="/donate"           element={<Donate />} />
              <Route path="/wall"             element={<Wall />} />
              <Route path="/chat"             element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/chat/:userId"     element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/price-calculator" element={<PriceCalculator />} />
              <Route path="/about"            element={<About />} />
              <Route path="/developer"        element={<Developer />} />
              <Route path="/ads"              element={<ProtectedRoute><Ads /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <AdPopup />
          <Toaster position="top-center" theme="dark" richColors />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
