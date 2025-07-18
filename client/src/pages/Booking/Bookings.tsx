import Payment from "../../components/Bookings/Payment";
import TerminalUserInfos from "../../components/Bookings/TerminalUserInfos";
import "./Booking.css";

function Bookings() {
  return (
    <>
      <div className="scrolling_text">
        <p>
          Ce site étant à but pédagogique, aucun système de paiement n'est mis
          en place, ainsi, les informations entrées ne sont transmises à aucun
          tiers ou services.
        </p>
      </div>
      <TerminalUserInfos />
      <Payment />
    </>
  );
}

export default Bookings;
