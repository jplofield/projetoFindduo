import styles from "./PostDetail.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import LikeButton from "./LikeButton";

const PostDetail = ({ post }) => {
  // Estado local para armazenar a URL da foto de perfil do autor do post
  const [photoURL, setPhotoURL] = useState("");

  // Hook useEffect para buscar a foto de perfil do autor quando o componente é montado
  useEffect(() => {
    const fetchUserPhoto = async () => {
      // Verifica se existe o ID do usuário no post
      if (post.uid) {
        try {
          // Cria uma referência ao documento do usuário na coleção "users" com o ID armazenado em post.uid
          const userRef = doc(db, "users", post.uid);
          // Busca o documento do usuário no Firestore
          const userDoc = await getDoc(userRef);

          const userPhoto = userDoc.data().photoURL;

          // Verifica se o documento do usuário existe
          if (userDoc.exists()) {
            // Define a URL da foto de perfil no estado photoURL. Se não houver uma foto, define uma imagem padrão
            setPhotoURL(
              userPhoto && userPhoto.trim()
                ? userPhoto
                : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
            );
          }
        } catch (error) {
          console.error("Erro ao buscar foto do usuário:", error);
        }
      }
    };

    fetchUserPhoto();
  }, [post.uid]); // Executa o efeito quando a propriedade post.uid muda

  // Renderização do conteúdo do post
  return (
    <div className={styles.post_detail}>
      <div className={styles.createdBy}>
        <img
          src={
            photoURL ||
            "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
          }
          alt={`Foto de ${post.createdBy}`}
          className={styles.avatar}
        />
        <span className={styles.username}>{post.createdBy}</span>
      </div>
      <img
        src={post.image}
        alt={post.title}
      />
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <div className={styles.tags}>
        {/* Mapeia as tags do post e exibe cada uma com um símbolo '#' */}
        {post.tagsArray.map((tag) => (
          <p key={tag}>
            <span>#</span>
            {tag}
          </p>
        ))}
      </div>
      <div className={styles.feedback}>
        <LikeButton postId={post.id} /> {/* Usa o novo componente */}
        <Link
          to={`/posts/${post.id}`}
          className={styles.comments}
        >
          Comentários
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
