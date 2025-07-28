import { useEffect, useState } from "react";
import "./BookingHistory.css";
import { useAuth } from "../../context/AuthContext";

type Booking = {
  id: number;
  nom_station: string;
  adresse_station: string;
  start_time: string;
  end_time: string;
};

const BookingHistory = () => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated || !user?.id) {
      setError(
        "Vous devez être connecté pour voir l'historique de vos réservations.",
      );
      setLoadingBookings(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/user/${user.id}`,
          {
            credentials: "include",
          },
        );
        if (!response.ok)
          throw new Error("Erreur de chargement des réservations.");

        const data = await response.json();
        setBookings(data);
      } catch (error: unknown) {
        console.error("Erreur lors du fetch des réservations:", error);
        if (error instanceof Error) {
          setError(error.message || "Impossible de charger les réservations.");
        } else {
          setError(
            "Une erreur inconnue est survenue lors du chargement des réservations.",
          );
        }
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user, isAuthLoading, isAuthenticated]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}`,
        { method: "DELETE", credentials: "include" },
      );

      if (!response.ok) throw new Error("Erreur de suppression.");

      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression :", error);
      if (error instanceof Error) {
        setError(error.message || "Impossible de supprimer la réservation.");
      } else {
        setError("Une erreur inconnue est survenue lors de la suppression.");
      }
    }
  };

  if (isAuthLoading || loadingBookings)
    return <p>Chargement des réservations...</p>;
  if (error) return <p className="error-message">Erreur: {error}</p>;

  if (!isAuthenticated || !user?.id) {
    return (
      <p className="error-message">
        Veuillez vous connecter pour accéder à l'historique de vos réservations.
      </p>
    );
  }

  return (
    <div className="booking-history">
      <h2>Historique des réservations</h2>
      {bookings.length === 0 ? (
        <p>Aucune réservation trouvée pour cet utilisateur.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Station</th>
              <th>Adresse</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.nom_station}</td>
                <td>{booking.adresse_station}</td>
                <td>{new Date(booking.start_time).toLocaleString()}</td>
                <td>{new Date(booking.end_time).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(booking.id)}
                    className="btn-delete"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingHistory;
