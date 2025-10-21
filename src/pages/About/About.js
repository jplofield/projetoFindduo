// CSS
import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h2>Sobre o Findduo</h2>
      <p>
        A proposta desta rede social é que a comunidade gamer tenha um espaço
        para se conectar com outras pessoas, entendendo que há uma demanda
        considerável quando se trata de achar alguém para jogar junto e
        compartilhar experiências online.
      </p>
      <Link
        to="/posts/create"
        className="btn btn-outline-light"
      >
        Criar post
      </Link>
    </div>
  );
};

export default About;
