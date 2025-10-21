import styles from "./Post.module.css";
import { useState, useEffect } from "react";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import {
  addDoc,
  getDoc,
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// componente
import LikeButton from "../../components/LikeButton";

// data
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Post = () => {
  const { id } = useParams();
  const { document: post, loading } = useFetchDocument("posts", id);
  const [photoURL, setPhotoURL] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [setError] = useState("");
  const { user } = useAuthValue();

  // Busca a foto do autor do post
  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (post && post.uid) {
        try {
          const userRef = doc(db, "users", post.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userPhoto = userDoc.data().photoURL;
            setPhotoURL(
              userPhoto && userPhoto.trim()
                ? userPhoto
                : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
            );
          } else {
            setPhotoURL(
              "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
            );
          }
        } catch (error) {
          console.error("Erro ao buscar foto do usuário:", error);
          setPhotoURL(
            "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
          );
        }
      }
    };
    if (post) fetchUserPhoto();
  }, [post]);

  // Carregar comentários em tempo real
  useEffect(() => {
    const fetchComments = async () => {
      if (post) {
        setLoadingComments(true);
        const commentsRef = collection(db, "posts", id, "comments");
        const q = query(commentsRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const commentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(commentsData);
          setLoadingComments(false);
        });

        return () => unsubscribe(); // Limpa o listener ao desmontar o componente
      }
    };
    fetchComments();
  }, [id, post]);

  // Função para adicionar um comentário
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setError("O comentário não pode estar vazio.");
      return;
    }

    try {
      const commentsRef = collection(db, "posts", id, "comments");
      await addDoc(commentsRef, {
        text: commentText,
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      setError("Erro ao adicionar comentário. Tente novamente.");
    }
  };

  if (loading) return <p>Carregando post...</p>;
  if (!post) return <p>Post não encontrado.</p>;

  return (
    <div className={styles.post_container}>
      <div className={styles.post_detail}>
        {/* Conteúdo do post */}
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
          {post.tagsArray?.map((tag) => (
            <p key={tag}>
              <span>#</span>
              {tag}
            </p>
          ))}
        </div>
        <LikeButton postId={id} />
      </div>

      {/* Seção de comentários */}
      <div className={styles.comments_section}>
        <h3>Comentários</h3>
        <form onSubmit={handleAddComment}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Digite seu comentário..."
            required
          />
          <button type="submit">Comentar</button>
        </form>
        {/* Lista de comentários */}
        {loadingComments ? (
          <p>Carregando comentários...</p>
        ) : (
          <div className={styles.comments_list}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={styles.comment}
              >
                <img
                  src={
                    comment.photoURL ||
                    "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
                  }
                  alt={`Foto de ${comment.displayName}`}
                  className={styles.comment_avatar}
                />
                <div className={styles.comment_content}>
                  <p className={styles.comment_author}>{comment.displayName}</p>
                  <p>{comment.text}</p>
                  <small>
                    {formatDistanceToNow(
                      new Date(comment.createdAt.seconds * 1000),
                      {
                        addSuffix: true,
                        locale: ptBR, // Para exibir em português
                      }
                    )}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
