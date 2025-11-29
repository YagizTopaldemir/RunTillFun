import { updateProfile } from "firebase/auth";
import { auth } from "../firebase"; 


export const updateUserName = async (newName) => {
  const user = auth.currentUser;

  if (!user) return { success: false, message: "Kullanıcı bulunamadı." };

  try {
    await updateProfile(user, {
      displayName: newName,
    });

    return { success: true };
  } catch (error) {
    console.log("Hata:", error);
    return { success: false, message: error.message };
  }
};
