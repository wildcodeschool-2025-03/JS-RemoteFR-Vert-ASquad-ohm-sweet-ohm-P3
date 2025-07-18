import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "./Review.css";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import ReviewForm from "../../pages/ReviewForm/ReviewForm";
import "../Modal/Modal.css";

type Review = {
  id: number;
  review: string;
  grade: number;
  user_id: number;
  firstname: string;
  lastname: string;
  profile_pic: string;
};

function Review() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const average =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.grade, 0) / reviews.length
      : 0;

  const stars = (note: number) => {
    const full = Math.floor(note);
    return "⭐️".repeat(full);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/review`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Erreur API :", error));
  }, []);

  return (
    <>
      <section className="reviewBloc">
        <h1 className="reviewstitle">NOS AVIS CLIENTS</h1>
        <div className="reviewStar">
          {stars(average)} ({average.toFixed(1)} / 5) — {reviews.length} avis
        </div>

        <Swiper
          className="swiperBloc"
          modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 20 },
            992: { slidesPerView: 3, spaceBetween: 20 },
          }}
          navigation={true}
        >
          {reviews.slice(0, 10).map((review) => (
            <SwiperSlide key={review.id} className="reviewsItem">
              <div className="swiperContent">
                <div className="idReview">
                  <img
                    className="reviewAvatar"
                    src={review.profile_pic}
                    alt={"avatar"}
                  />
                  <p className="reviewUser">{review.firstname}</p>
                </div>
                <p className="reviewText">"{review.review}"</p>

                <p className="reviewGrade">
                  {stars(review.grade)} {review.grade}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          className="btnReview"
          onClick={() => setIsModalOpen(true)}
        >
          Laisser un avis
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ReviewForm />
        </Modal>
      </section>
    </>
  );
}

export default Review;
