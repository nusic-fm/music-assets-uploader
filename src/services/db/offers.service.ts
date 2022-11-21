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
  const offerCollection = collection(db, "offers");
  await addDoc(offerCollection, offerDoc);
};

const updateOffer = async (uid: string, obj: Partial<Offer>): Promise<void> => {
  const userRef = doc(db, "offers", uid);
  await updateDoc(userRef, obj);
};

const getOffersFromId = async (id: number): Promise<OfferDbDoc[]> => {
  const q = query(
    collection(db, "offers"),
    where("tokenId", "==", id),
    where("isActive", "==", true),
    where("isSold", "==", false)
  );
  const querySnapshots = await getDocs(q);
  const offers: OfferDbDoc[] = [];
  querySnapshots.forEach((doc) => {
    offers.push({ ...(doc.data() as OfferDbDoc), id: doc.id });
  });
  return offers;
};
const cancelOffer = async (id: string) => {
  const offerDoc = doc(db, "offers", id);

  await updateDoc(offerDoc, {
    isActive: false,
  });
};

export { createOffer, updateOffer, getOffersFromId, cancelOffer };