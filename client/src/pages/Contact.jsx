import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faPen,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Contact.module.css";
import axios from "axios";
import { BASE_URL } from "../constants.js";
import { useState } from "react";

const Contact = () => {
  return (
    <>
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.welcomeSection}></div>
          <div className={styles.contentLayout}>
            <ContactForm />
            <Map />
          </div>
        </main>
      </div>
    </>
  );
};

const Map = () => (
  <div className={styles.mapIframeContainer} style={{ width: "50%" }}>
    <iframe
      width="100%"
      height="600"
      src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=IIT%20Ropar,%20Main%20Campus+(IIT%20Ropar%20Guest%20House)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
      title="IIT Ropar Location"
    ></iframe>
  </div>
);

const ContactForm = () => {
  const [data, setData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    console.log(e.target);
    const req = await axios.post(BASE_URL + "/utils/mail", {
      to: "dep.test.p04@gmail.com",
      subject: "Guest house feedback",
      body: data.message + `<br /><br />From: ${data.name}<br />${data.email}`,
    });
    console.log(req);
    setData({ name: "", email: "", message: "" })
    // sendVerificationEmail("dep.test.p04@gmail.com","Contact Us request - ", )
  };
  return (
    <section className={styles.contact}>
      <form className={styles.contactForm}>
        <h2
          className={
            styles.contactUs +
            ' text-center font-semibold font-["Dosis"] text-2xl pb-5'
          }
        >
          CONTACT US
        </h2>
        <div className={styles.formGroup}>
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            onChange={(e) => {
              setData({ ...data, name: e.target.value });
            }}
            value={data.name}
          />
        </div>
        <div className={styles.formGroup}>
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            required
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
            }}
            value={data.email}
          />
        </div>
        <div className={styles.formGroup}>
          <FontAwesomeIcon icon={faPen} />
          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Your Message"
            onChange={(e) => {
              setData({ ...data, message: e.target.value });
            }}
            required
            value={data.message}
          ></textarea>
        </div>
        <submit
          onClick={handleSubmit}
          className={styles.submitButton + " ml-7 mt-2"}
        >
          Send Message
        </submit>
      </form>
    </section>
  );
};

export default Contact;
