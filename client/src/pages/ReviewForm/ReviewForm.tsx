import { Rating } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import "./ReviewForm.css";
import { useNavigate } from "react-router";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

type ReviewFormFields = {
  onClose: () => void;
  user_id: number;
  review: string;
  grade: number;
};
type ReviewFormProps = {
  onClose?: () => void;
};

export default function ReviewForm({ onClose }: ReviewFormProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ReviewFormFields>({
    defaultValues: {
      review: "",
      user_id: 0,
      grade: 0,
    },
  });
  const navigate = useNavigate();

  const onSubmitForm = async (data: ReviewFormFields) => {
    if (!user || user.id === null || user.id === undefined) {
      toast.error("Utilisateur non chargé !");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/review/:id`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            review: data.review,
            grade: data.grade,
          }),
        },
      );

      if (response.ok) {
        toast.success("Avis envoyé !");
        if (onClose) onClose();
        setTimeout(() => {
          navigate("/maps");
        }, 1000);
      } else {
        toast.error("Erreur lors de l’envoi");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="ReviewFormBloc">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Bounce}
      />
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="swiperContent">
          <div className="idReview">
            <img
              className="reviewAvatar"
              src={user?.profile_pic}
              alt="avatar"
            />
            <p className="reviewUser">{user?.firstname}</p>
          </div>
        </div>

        <label htmlFor="user_id" className="TilteForm">
          LAISSER UN AVIS
        </label>
        <input id="user_id" type="hidden" {...register("user_id")} />

        <input type="hidden" {...register("user_id")} />

        <label htmlFor="grade">Note :</label>
        <Controller
          name="grade"
          control={control}
          render={({ field }) => (
            <Rating
              {...field}
              id="grade"
              value={field.value}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />

        <input
          className="inputReview"
          {...register("review", { required: true })}
          placeholder="Ton avis ici"
        />
        {errors.review && <p className="error">Ce champ est requis</p>}

        <input className="submitBtnReview" type="submit" value="Envoyer" />
      </form>
    </section>
  );
}
