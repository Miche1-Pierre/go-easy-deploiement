import { useEffect, useState } from "react";
import type { Booking } from "../types";
import { BookingApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  function load() {
    BookingApi.mine()
      .then(setBookings)
      .catch((e) => setError(extractErrorMessage(e)));
  }
  useEffect(load, []);
  async function cancel(id: number) {
    try {
      await BookingApi.cancel(id);
      load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }
  return (
    <div className="container">
      <h1>Mes réservations</h1>
      {error && <p className="error">{error}</p>}
      {!bookings.length ? (
        <p>Vous n'avez pas encore de réservation.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Activité</th>
              <th>Ville</th>
              <th>Date</th>
              <th>Participants</th>
              <th>Total</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.activity?.title}</td>
                <td>{b.activity?.city}</td>
                <td>
                  {b.activity
                    ? new Date(b.activity.startDate).toLocaleString("fr")
                    : "-"}
                </td>
                <td>{b.participants}</td>
                <td>{Number(b.totalPrice).toFixed(2)}€</td>
                <td>
                  <span
                    className={`badge ${b.status === "CANCELLED" ? "badge-grey" : "badge-green"}`}
                  >
                    {b.status === "CONFIRMED" ? "Confirmée" : "Annulée"}
                  </span>
                </td>
                <td>
                  {b.status === "CONFIRMED" && (
                    <button
                      className="link-button danger"
                      onClick={() => cancel(b.id)}
                    >
                      Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
