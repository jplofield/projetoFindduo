import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrP7Nla0CUQ7S6wDIEJ1lpE22RlBv-Nhw",
  authDomain: "miniblog-13a89.firebaseapp.com",
  projectId: "miniblog-13a89",
  storageBucket: "miniblog-13a89.appspot.com",
  messagingSenderId: "12739687761",
  appId: "1:12739687761:web:991ad0364171afd7d4cf70",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Inicializando o storage corretamente

export { db, auth, app, storage }; // Adicione storage à lista de exportação

// Função de upload
export async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, `${currentUser.uid}.png`); // Corrigindo a referência do arquivo

  setLoading(true);
  try {
    const snapshot = await uploadBytes(fileRef, file);
    console.log("Upload realizado com sucesso:", snapshot);
  } catch (error) {
    console.error("Erro no upload:", error);
  } finally {
    setLoading(false);
  }
}
