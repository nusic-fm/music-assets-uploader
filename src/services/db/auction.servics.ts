import {
  //   doc,
  updateDoc,
  //   setDoc,
  //   getDoc,
  // addDoc,
  arrayUnion,
  // collection,
  //   query,
  //   where,
  //   getDocs,
  doc,
  getDoc,
  setDoc,
  //   doc,
  //   updateDoc,
} from "firebase/firestore";
import { AuctionTokenDoc, BidDoc } from "../../models/BidAuction";
// import { Offer, OfferDbDoc } from "../../models/Offer";
import { db } from "../firebase.service";

const collection = "auctions/bsc/tokens";

const createAuction = async (
  tokenId: string,
  offerDoc: AuctionTokenDoc
): Promise<void> => {
  const offerCollection = doc(db, collection, tokenId);
  await setDoc(offerCollection, offerDoc);
};

const updateAuction = async (tokenId: string, bid: BidDoc): Promise<void> => {
  const userRef = doc(db, collection, tokenId);
  await updateDoc(userRef, {
    bids: arrayUnion(bid),
  });
};

const getAucitonFromTokenId = async (
  tokenId: string
): Promise<AuctionTokenDoc | null> => {
  const q = doc(db, collection, tokenId);
  const docSnapshot = await getDoc(q);
  if (docSnapshot.exists()) {
    const auctionDoc = docSnapshot.data() as AuctionTokenDoc;
    return auctionDoc;
  } else {
    return null;
  }
};
// const cancelOffer = async (id: string) => {
//   const offerDoc = doc(db, "offers", id);

//   await updateDoc(offerDoc, {
//     isActive: false,
//   });
// };

export { createAuction, updateAuction, getAucitonFromTokenId };
