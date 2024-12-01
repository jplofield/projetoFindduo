import { NavLink } from "react-router-dom";

import { useAuthentication } from "../hooks/useAuthentication";

import { useAuthValue } from "../context/AuthContext";

import styles from "./Navbar.module.css";
import logoDark from "../images/logo_dark.png";

const Navbar = () => {
  const { user } = useAuthValue();
  const { logout } = useAuthentication();

  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/"
        className={styles.brand}
      >
        <img
          src={logoDark}
          alt="Home"
        />
      </NavLink>
      <ul className={styles.links_list}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Início
          </NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Entrar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Cadastrar
              </NavLink>
            </li>
          </>
        )}
        {user && (
          <>
            <li>
              <NavLink
                to="/posts/create"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Nova publicação
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Minhas publicações
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Perfil
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Sobre
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Support"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Suporte
          </NavLink>
        </li>
        {user && (
          <li>
            <button onClick={logout}>Sair</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
