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
  doc,
  updateDoc,
} from "firebase/firestore";
import { Offer, OfferDbDoc } from "../../models/Offer";
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

const getOffersFromId = async (id: number): Promise<OfferDbDoc[]> => {
  const q = query(collection(db, "offers"), where("tokenId", "==", id));
  const querySnapshots = await getDocs(q);
  const offers: OfferDbDoc[] = [];
  querySnapshots.forEach((doc) => {
    offers.push({ ...(doc.data() as OfferDbDoc), id: doc.id });
  });
  return offers.filter((o) => !o.isCancelled);
};
const cancelOffer = async (id: string) => {
  const offerDoc = doc(db, "offers", id);
  try {
    await updateDoc(offerDoc, {
      isCancelled: true,
    });
  } catch (e) {
    alert("Error, please try again later.");
    console.log(e);
  }
};

export { createOffer, getOffersFromId, cancelOffer };
