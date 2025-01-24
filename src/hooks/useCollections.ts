import { Collection } from "../types/types";
import { useQuery } from "react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";

const fetchCollections = async (userId: string): Promise<Collection[]> => {
  const data = await getDocs(query(collection(db, "collections"), where("userId", "==", userId)));
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Collection[];
};

export const useCollections = (userId: string ) => {
  return useQuery<Collection[], Error>(["collections", userId], () => fetchCollections(userId), {
    enabled: !!userId,
  });
};