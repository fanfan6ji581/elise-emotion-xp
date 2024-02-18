import db from "./firebase";
import { doc, updateDoc, getDocs, query, collection, where } from "firebase/firestore";

const TABLE = "xp";

const getXp = async (alias) => {
    const snapshot = await getDocs(query(collection(db, TABLE), where("alias", "==", alias)));
    const docs = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    if (docs.length === 1) {
        return docs[0]
    } else {
        throw new Error(`Cannot find xp with alias "${alias}"`)
    }
};

const updateXp = async (id, data) => {
    const xpDocRef = doc(db, TABLE, id);
    await updateDoc(xpDocRef, data);
};

export {
    getXp,
    updateXp,
}