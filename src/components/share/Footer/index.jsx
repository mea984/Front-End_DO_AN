import React from "react";
import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footer__desc}>
        Use of ImgBB constitutes acceptance of our{" "}
        <Link className={styles.footer__desc__link}>Terms of Service</Link> and
        <Link className={styles.footer__desc__link}> Privacy Policy.</Link>
      </p>
    </footer>
  );
}

export default Footer;
