import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { User } from "../../models/User";
import { db } from "../firebase.service";

const createUser = async (uid: string, userDoc: User): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDocRef = await getDoc(userRef);
    if (userDocRef.exists()) {
    } else {
      await setDoc(userRef, userDoc);
    }
  } catch (e) {}
};

const updateUser = async (uid: string, obj: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, obj);
};

export { createUser, updateUser };
