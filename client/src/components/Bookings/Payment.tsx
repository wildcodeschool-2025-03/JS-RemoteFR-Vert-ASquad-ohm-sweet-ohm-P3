import "./Payment.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type PaymentFormInputs = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  duration: string;
};

type Terminal = {
  adresse_station: string;
};

function Payment() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormInputs>();

  const generateTimeSlots = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  const onSubmit = async (data: PaymentFormInputs) => {
    if (!user || !id) return;

    const today = new Date();
    const [hours, minutes] = data.duration.split(":").map(Number);

    const startTime = new Date(today);
    startTime.setHours(hours);
    startTime.setMinutes(minutes);
    startTime.setSeconds(0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30);

    const payload = {
      terminal_id: Number.parseInt(id),
      user_id: user.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Paiement et réservation effectués avec succès !");
      } else {
        alert("❌ Une erreur est survenue lors de la réservation.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Erreur réseau.");
    }
  };

  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTerminal = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/terminals/${id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setTerminal(data);
      }
    };

    if (id) fetchTerminal();
  }, [id]);

  return (
    <div className="payment-wrapper">
      <div className="payment-box">
        <h3>Paiement sécurisé</h3>
        <div className="card-icons">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input
            type="text"
            placeholder="**** **** **** ****"
            maxLength={16}
            {...register("cardNumber", {
              required: "Numéro de carte requis",
              pattern: {
                value: /^\d{16}$/,
                message: "16 chiffres requis",
              },
            })}
          />
          {errors.cardNumber && (
            <p className="error">{errors.cardNumber.message}</p>
          )}

          <div className="card-details">
            <input
              type="text"
              placeholder="MM / AA"
              maxLength={5}
              {...register("expiry", {
                required: "Date d'expiration requise",
                pattern: {
                  value: /^\d{2}\/\d{2}$/,
                  message: "Format MM/AA requis",
                },
              })}
            />
            <input
              type="text"
              placeholder="CVC"
              maxLength={3}
              {...register("cvc", {
                required: "CVC requis",
                pattern: {
                  value: /^\d{3}$/,
                  message: "3 chiffres requis",
                },
              })}
            />
          </div>
          {errors.expiry && <p className="error">{errors.expiry.message}</p>}
          {errors.cvc && <p className="error">{errors.cvc.message}</p>}

          <button type="submit">Payer</button>
        </form>
      </div>

      <div className="summary-box">
        <div className="summary-header">
          <span>Montant Total :</span>
          <strong>25 €</strong>
        </div>
        <div className="summary-info">
          <div>
            <span>Début</span>
            <select
              {...register("duration", {
                required: "Veuillez sélectionner une durée",
              })}
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionner une durée
              </option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="error">{errors.duration.message}</p>
            )}
          </div>
          <div>
            <span>Durée</span>
            <br />
            <strong>30 min</strong>
          </div>
        </div>
        <div className="summary-address">
          <p>
            <strong>📍 Adresse directe</strong>
          </p>
          <p>{terminal?.adresse_station || "Chargement de l'adresse..."}</p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
