import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthValue } from "../context/AuthContext";

import styles from "./LikeButton.module.css";

// Imagens dos ícones de like e deslike
import heartRegular from "../heart-regular.svg";
import heartSolid from "../heart-solid.svg";

const LikeButton = ({ postId }) => {
  const { user } = useAuthValue();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      if (postId) {
        try {
          const postRef = doc(db, "posts", postId);
          const postDoc = await getDoc(postRef);

          if (postDoc.exists()) {
            const postData = postDoc.data();
            setLikes(postData.likes?.length || 0);
            if (user) setHasLiked(postData.likes?.includes(user.uid) || false);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do post:", error);
        }
      }
    };

    fetchLikes();
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) {
      alert("Você precisa estar logado para curtir a postagem.");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);

      if (hasLiked) {
        await updateDoc(postRef, { likes: arrayRemove(user.uid) });
        setLikes((prev) => prev - 1);
      } else {
        await updateDoc(postRef, { likes: arrayUnion(user.uid) });
        setLikes((prev) => prev + 1);
      }

      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("Erro ao atualizar likes:", error);
    }
  };

  return (
    <div>
      <button
        onClick={toggleLike}
        className={styles.likeButton}
      >
        <img
          src={hasLiked ? heartSolid : heartRegular}
          alt="Like"
          width={20}
        />
        <span> {likes}</span>
      </button>
    </div>
  );
};

export default LikeButton;
