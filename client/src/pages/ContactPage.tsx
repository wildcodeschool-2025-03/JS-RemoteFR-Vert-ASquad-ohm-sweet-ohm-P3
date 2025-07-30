import ContactForm from "../components/Contact/Form";
import "./ContactPage.css";

function Contact() {
  return (
    <>
      <section className="presentation-contact">
        <h1 className="h1contact">Contact</h1>
        <p>
          Pour contacter le service client et pour toute demande d'Informations,
          de partenariat ou une autre demande, veuillez renseigner les champs
          ci-dessous.
        </p>
      </section>

      <ContactForm />
    </>
  );
}

export default Contact;
