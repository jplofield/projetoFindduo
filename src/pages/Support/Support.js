import styles from "./Support.module.css";

// images
import qrcode from "../../images/qrcode.png";

const Support = () => {
  return (
    <div className={styles.support}>
      <h1>Suporte</h1>
      <p>
        Para quaisquer dúvidas ou problemas que vierem a surgir, escaneie nosso
        QR code para entrar em contato com nosso suporte.
      </p>
      <img
        src={qrcode}
        alt="qr_code"
      />
    </div>
  );
};

export default Support;
