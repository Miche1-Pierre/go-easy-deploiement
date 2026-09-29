import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <div className="container narrow">
      <h1>Créer votre compte</h1>
      <div className="form">
        <label>
          Prénom
          <input
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </label>
        <label>
          Nom
          <input
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
        <label>
          Mot de passe (6 caractères minimum)
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button onClick={submit}>S'inscrire</button>
        <p className="muted">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
