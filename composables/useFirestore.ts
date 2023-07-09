import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const queryByCollection = async (col: string) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = collection($firestore, col);

  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
};

export const set = async (col: string, document: Object) => {
  const {$firestore} = useNuxtApp();

  await setDoc(doc(collection($firestore, col)), document, { merge: true });
};

export const add = async (col: string, document: Object) => {
  const {$firestore} = useNuxtApp();

  // @ts-ignore
  const colRef = collection($firestore, col);

  const docRef = await addDoc(colRef, document);

  return docRef;
};

export const update = async (col: string, id: string, document:any) => {
  const {$firestore} = useNuxtApp();

  const docRef = doc($firestore, col, id);

  await updateDoc(docRef, document);

  return docRef;

};

export const deleteByCollection = async (col : string, id : string) => {
  const {$firestore} = useNuxtApp();

  const docRef = doc($firestore, col, id);
  return await deleteDoc(docRef);
};