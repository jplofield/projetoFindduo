import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const db = getFirestore();

const UserProfile = ({ toggleTheme }) => {
  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  

  // 🔹 Inicializa o usuário logado (Firebase)
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPhotoUrl(
          currentUser.photoURL ||
            "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
        );
      } else {
        setUser(null);
      }
    });
  }, []);

  // 🔹 Modal de atualização de foto
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPhotoUrl("");
  };

  // 🔹 Atualizar foto de perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPhotoUrl) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), { photoURL: newPhotoUrl }, { merge: true });

      const auth = getAuth();
      await updateProfile(auth.currentUser, { photoURL: newPhotoUrl });

      setPhotoUrl(newPhotoUrl);
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar a foto de perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Loading inicial (usuário Firebase)
  if (!user) {
    return <p className={styles.loading}>Carregando perfil...</p>;
  }

  return (
    <div className={styles.container}>
      {/* PERFIL DO USUÁRIO (FIREBASE) */}
      <div className={styles.profile}>
        <img src={photoUrl} alt="Avatar do Usuário" className={styles.avatar} />
        <div className={styles.userInfo}>
          <p><strong>Nome:</strong> {user.displayName || "Usuário sem nome"}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <button onClick={openModal} className={styles.editButton}>
          Editar foto
        </button>

        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <h3>Insira a URL da nova foto de perfil</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="url"
                  placeholder="URL da imagem"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Atualizando..." : "Salvar"}
                </button>
                <button type="button" onClick={closeModal}>
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

