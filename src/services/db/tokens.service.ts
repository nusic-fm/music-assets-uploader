import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Token } from "../../models/Token";
import { User } from "../../models/User";
import { db } from "../firebase.service";

const getTokens = async (): Promise<Token[]> => {
  const q = query(collection(db, "tokens"));
  const querySnapshots = await getDocs(q);
  const tokens: Token[] = [];
  querySnapshots.forEach((doc) => {
    tokens.push({ ...(doc.data() as Token), id: doc.id.split("-")[1] });
  });
  return tokens.sort((a, b) => Number(a.id) - Number(b.id));
};

const updateTokenOwner = async (
  tokenId: string,
  newOwnerDetails: Partial<User>,
  prevOwnerId: string,
  offerId: string
) => {
  const docId = `feral-${tokenId}`;
  const docRef = doc(db, "tokens", docId);
  await updateDoc(docRef, {
    ownerId: newOwnerDetails.uid,
    name: newOwnerDetails.name,
    avatar: newOwnerDetails.avatar,
    previousOwnerIds: arrayUnion(prevOwnerId),
    acceptedOffers: arrayUnion({
      offerId,
      createdAt: new Date().toUTCString(),
    }),
  });
};

export { getTokens, updateTokenOwner };
