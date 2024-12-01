import styles from "./Dashboard.module.css";

import { Link } from "react-router-dom";

// hooks
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const Dashboard = () => {
  const { user } = useAuthValue();
  const uid = user.uid;

  const { documents: posts, loading } = useFetchDocuments("posts", null, uid);

  const { deleteDocument } = useDeleteDocument("posts");

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h2>Gerencie suas publicações</h2>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Ops... está vazio.</p>
          <Link
            to="/posts/create"
            className="btn btn-outline"
          >
            Criar primeira publicação
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Título</span>
            <span>Ações</span>
          </div>

          {posts &&
            posts.map((post) => (
              <div
                key={post.id}
                className={styles.post_row}
              >
                <p>{post.title}</p>
                <div>
                  <Link
                    to={`/posts/${post.id}`}
                    className="btn btn-outline-light"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`posts/edit/${post.id}`}
                    className="btn btn-outline-light"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteDocument(post.id)}
                    className="btn btn-outline btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;
