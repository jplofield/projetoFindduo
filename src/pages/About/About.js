// CSS
import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h2>Sobre o Findduo</h2>
      <p>
        Este projeto tem o objetivo de criar um site no qual os jogadores possam
        encontrar outras pessoas para jogar e publicar suas conquistas nos campos
        de batalha.
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
