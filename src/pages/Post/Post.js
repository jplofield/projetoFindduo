import styles from "./Post.module.css";

// hooks
import { useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const Post = () => {
  const { id } = useParams();
  const { document: post, loading } = useFetchDocument("posts", id);

  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (post && post.uid) {
        try {
          const userRef = doc(db, "users", post.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setPhotoURL(
              userDoc.data().photoURL ||
                "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
            );
          }
        } catch (error) {
          console.error("Erro ao buscar foto do usuário:", error);
        }
      }
    };

    if (post) fetchUserPhoto();
  }, [post]);

  if (loading) return <p>Carregando post...</p>;

  if (!post) return <p>Post não encontrado.</p>;

  return (
    <div className={styles.post_container}>
      <div className={styles.post_detail}>
        <div className={styles.createdBy}>
          <img
            src={photoURL}
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
      </div>
    </div>
  );
};

export default Post;
