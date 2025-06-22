import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "./Review.css";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useEffect, useState } from "react";

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

  // Appel API quand le composant se charge
  useEffect(() => {
    fetch("http://localhost:3310/api/review")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Erreur API :", error));
  }, []);

  return (
    <div className="reviewBloc">
      <h1 className="reviewstitle">NOS AVIS CLIENTS</h1>
      <div className="reviewStar">✩✩✩✩✩ {reviews.length} avis</div>

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
              <p className="reviewGrade">✩✩✩✩✩ {review.firstname}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button type="button" className="btnReview">
        Laisser un avis
      </button>
    </div>
  );
}

export default Review;
