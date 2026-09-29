import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="message">
        Attention : ce site est fourni à des fins pédagogiques, son contenu est
        factice.
      </div>
      <nav className="navbar">
        <Link to="/" className="brand">
          <img alt="logo GoEasy" src="/go-easy.png" /> GoEasy
        </Link>
        <div className="nav-links">
          <Link to="/">Activités</Link>
          {user ? (
            <>
              <Link to="/bookings">Mes réservations</Link>
              <span className="nav-user">
                {user.firstName + " " + user.lastName}
              </span>
              <button
                className="link-button"
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register">S'inscrire</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
