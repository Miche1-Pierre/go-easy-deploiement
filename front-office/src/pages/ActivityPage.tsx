import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Activity } from "../types";
import { ActivityApi, BookingApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
export function ActivityPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    ActivityApi.get(id)
      .then(setActivity)
      .catch((e) => setError(extractErrorMessage(e)));
  }, [id]);
  async function book() {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await BookingApi.create({ activityId: id, participants });
      setSuccess(true);
      setError("");
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }
  if (!activity)
    return (
      <div className="container">
        <p>{error || "Chargement..."}</p>
      </div>
    );
  return (
    <div className="container">
      <button className="link-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      <img
        src={activity.imageUrl}
        alt={activity.title}
        className="hero-image"
      />
      <span className="badge">{activity.category}</span>
      <h1>{activity.title}</h1>
      <p>{activity.description}</p>
      <div className="room-row">
        <div>
          <p>
            <strong>Date :</strong>{" "}
            {new Date(activity.startDate).toLocaleString("fr")}
          </p>
          <p>
            <strong>Rendez-vous :</strong> {activity.meetingPoint},{" "}
            {activity.city}
          </p>
          <p>
            <strong>Durée :</strong> {activity.durationMinutes} minutes
          </p>
        </div>
        <div className="room-price">
          <span className="price">
            {Number(activity.pricePerPerson).toFixed(2)}€
          </span>
          <span className="muted"> / personne</span>
          <div className="participants">
            <label>
              Nombre de participants
              <input
                type="number"
                min="1"
                max={activity.capacity}
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
              />
            </label>
          </div>
          <span>
            Total :{" "}
            {(participants * Number(activity.pricePerPerson)).toFixed(2)}€
          </span>
          <button onClick={book}>Réserver</button>
        </div>
      </div>
      {success && (
        <p className="success">
          Réservation confirmée. Retrouvez-la dans « Mes réservations ».
        </p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
