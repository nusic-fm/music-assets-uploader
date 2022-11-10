import {
  //   doc,
  //   updateDoc,
  //   setDoc,
  //   getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Offer } from "../../models/Offer";
import { db } from "../firebase.service";

const createOffer = async (offerDoc: Offer): Promise<void> => {
  try {
    const offerCollection = collection(db, "offers");
    await addDoc(offerCollection, offerDoc);
  } catch (e) {
    alert("Error, please try again later.");
    console.log(e);
  }
};

// const updateUser = async (uid: string, obj: Partial<User>): Promise<void> => {
//   const userRef = doc(db, "users", uid);
//   await updateDoc(userRef, obj);
// };

const getOffersFromId = async (id: string) => {
  const q = query(collection(db, "offers"), where("tokenId", "==", id));
  const querySnapshots = await getDocs(q);
  const offers: Offer[] = [];
  querySnapshots.forEach((doc) => {
    offers.push(doc.data() as Offer);
  });
  return offers;
};

export { createOffer, getOffersFromId };
