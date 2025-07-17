import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "./ReviewForm.css";
import { useNavigate } from "react-router";
import { Bounce, ToastContainer, toast } from "react-toastify";

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
  const [userId, setUserId] = useState<number | null>(null);
  const [firstname, setFirstname] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");

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

  useEffect(() => {
    fetch("http://localhost:3310/api/users/1")
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        setFirstname(data.firstname);
        setProfilePic(data.profile_pic);
      });
  }, []);

  const onSubmitForm = async (data: ReviewFormFields) => {
    if (userId === null) {
      toast.error("Utilisateur non chargé !");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/review/1`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
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
    <div className="ReviewFormBloc">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Bounce}
      />
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="swiperContent">
          <div className="idReview">
            <img className="reviewAvatar" src={profilePic} alt="avatar" />
            <p className="reviewUser">{firstname}</p>
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
    </div>
  );
}
