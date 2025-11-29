import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const saveRunToFirebase = async (runData) => {
  const user = auth.currentUser;
  
  if (!user) return;

  try {
    await addDoc(collection(db, "users", user.uid, "runs"), {
      ...runData,
      timestamp: Date.now(),
    });

    console.log("Koşu kaydedildi");
  } catch (e) {
    console.log("Hata:", e);
  }
};
