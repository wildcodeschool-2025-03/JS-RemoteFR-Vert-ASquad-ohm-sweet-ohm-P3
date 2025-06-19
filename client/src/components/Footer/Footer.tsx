import AppleStoreLogo from "../../assets/images/AppleStore.png";
import GoogleStoreLogo from "../../assets/images/GooglePlay.png";
import "../Footer/Footer.css";

function Footer() {
  return (
    <>
      <footer>
        <ul className="ListFooter">
          <li>Contact</li>
          <li>Actualités / Informations</li>
          <li>Qui sommes nous ?</li>
          <li>Mention legales</li>
        </ul>
        <div className="StorePicture">
          <img
            src={GoogleStoreLogo}
            alt="Logo Google Play Store"
            className="StoreBadge"
          />
          <img
            src={AppleStoreLogo}
            alt="Logo Apple Store"
            className="StoreBadge"
          />
        </div>
      </footer>
    </>
  );
}

export default Footer;
