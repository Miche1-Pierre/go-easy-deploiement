import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ActivityPage } from "./pages/ActivityPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/activities/:id" element={<ActivityPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <footer>
          <p>
            Crédit logotype :&nbsp;
            <a href="https://www.flaticon.com/fr/auteurs/flat-icons">
              Flat Icons
            </a>
          </p>
        </footer>
      </BrowserRouter>
    </AuthProvider>
  );
}
