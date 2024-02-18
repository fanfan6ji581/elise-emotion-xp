import db from "./firebase";
import {
    getDoc, doc, updateDoc, addDoc,
    getDocs, collection, where, query, writeBatch
} from "firebase/firestore";

const TABLE = "data";

const updateData = async (id, data) => {
    const ref = doc(db, TABLE, id);
    await updateDoc(ref, data);
};

const addData = async (data) => {
    const resp = await addDoc(collection(db, TABLE), data);
    data.id = resp.id;
    return data
}

const getAllDataForXP = async (alias) => {
    const snapshot = await getDocs(query(collection(db, TABLE), where("xp_alias", "==", alias)));
    return snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
};

const getData = async (id) => {
    const docRef = doc(db, TABLE, id);
    const d = await getDoc(docRef)
    return Object.assign({ id: d.id }, d.data())
};

const deleteDataForXp = async (alias) => {
    // delete attendents
    const snapshot = await getDocs(query(collection(db, TABLE), where("xp_alias", "==", alias)));
    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
        batch.delete(document.ref);
    });
    await batch.commit();

}

export {
    addData,
    updateData,
    getAllDataForXP,
    getData,
    deleteDataForXp,
}