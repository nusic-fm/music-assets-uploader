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

const getUserDocsFromIds = async (ids: string[]) => {
  const q = query(collection(db, "users"), where("uid", "in", ids));
  const querySnapshots = await getDocs(q);
  const users: User[] = [];
  querySnapshots.forEach((doc) => {
    users.push(doc.data() as User);
  });
  return users;
};

export { createUser, updateUser, getUserDocsFromIds };
