import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const getUserRuns = async () => {
  try {
    const user = auth.currentUser;
    console.log("USER:", user);

    if (!user) return [];

   const runsRef = collection(db, "users", user.uid, "runs");
    console.log("runsRef OK");

    const q = query(runsRef, where("uid", "==", user.uid));
    console.log("Query created:", q);

    const snapshot = await getDocs(q);
    console.log("Snapshot:", snapshot);

    const runs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Runs:", runs);
    return runs;

  } catch (err) {
    console.log("🔥 GET RUNS ERROR:", err);
    return [];
  }
};
