import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Activity } from "../types";
import { ActivityApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
export function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setActivities(await ActivityApi.list(city, category));
      setError("");
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="container">
      <h1>Trouvez votre prochaine activité</h1>
      <p>
        Réservez une visite, une dégustation ou une excursion en quelques clics.
      </p>
      <div className="search-bar">
        <input
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={load}>Rechercher</button>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Chargement des activités...</p>
      ) : (
        <div className="card-grid">
          {activities.map((a) => (
            <Link to={`/activities/${a.id}`} key={a.id} className="card">
              <img src={a.imageUrl} alt={a.title} className="card-image" />
              <div className="card-body">
                <span className="badge">{a.category}</span>
                <h3>{a.title}</h3>
                <p className="muted">
                  {a.city} · {new Date(a.startDate).toLocaleString("fr")}
                </p>
                <p className="clamp">{a.description}</p>
                <strong>
                  {Number(a.pricePerPerson).toFixed(2)}€ / personne
                </strong>
              </div>
            </Link>
          ))}
          {!activities.length && <p>Aucune activité trouvée.</p>}
        </div>
      )}
    </div>
  );
}
