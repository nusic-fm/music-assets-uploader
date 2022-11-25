import {
  doc,
  updateDoc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { User } from "../../models/User";
import { db } from "../firebase.service";

const createUser = async (uid: string, userDoc: User): Promise<null | User> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDocRef = await getDoc(userRef);
    if (userDocRef.exists()) {
      const docData = userDocRef.data();
      if (docData.avatar !== userDoc.avatar) {
        await updateDoc(userRef, { avatar: userDoc.avatar });
      }
      return userDocRef.data() as User;
    } else {
      await setDoc(userRef, userDoc);
      return userDoc;
    }
  } catch (e) {
    console.log("ERROR: ", e);
    return null;
  }
};
const getUserById = async (uid: string): Promise<User> => {
  const userRef = doc(db, "users", uid);
  const userDocRef = await getDoc(userRef);
  return userDocRef.data() as User;
};

const updateUser = async (uid: string, obj: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, obj);
};

const getUserDocsFromIds = async (ids: string[]) => {
  const q = query(collection(db, "users"), where("uid", "in", ids));
  const querySnapshots = await getDocs(q);
  const users: User[] = [];
  querySnapshots.forEach((doc) => {
    users.push(doc.data() as User);
  });
  return users;
};

export { createUser, updateUser, getUserDocsFromIds, getUserById };
