import db from "./firebase";
import { collection, getDocs, addDoc, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";

const TABLE = "pretask";

const createPretask = (alias) => ({
    alias,
    created: Date.now(),
    totalQty: 100,
    ballALowerLimit: 10,
    ballAUpperLimit: 60,
    ballAQty: 25,
    ballAWin: 3,
    ballALose: -1,
    ballBWin: 1,
    ballBLose: -3,
    skip: 0,
    missLose: -1,
    x: 1,
    repeatLimit: 5,
    outcomeShowTime: 0,
    afkTimeout: 4000,
    choiceDelay: 0,
    percentageEarning: 50,
    enablePretaskPlaying: false,
    trainingSessionSeconds: 120,
})

const getPretask = async (alias) => {
    const snapshot = await getDocs(query(collection(db, TABLE), where("alias", "==", alias)));
    const docs = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    if (docs.length === 1) {
        return docs[0]
    } else {
        throw new Error(`Cannot find pretask with alias "${alias}"`)
    }
};

const updatePretask = async (id, data) => {
    const xpDocRef = doc(db, TABLE, id);
    await updateDoc(xpDocRef, data);
};

const addPretask = async (data) => {
    const resp = await addDoc(collection(db, TABLE), data);
    data.id = resp.id;
    return data
}

const deletePretask = async (alias) => {
    const pretask = await getPretask(alias);
    const xpDocRef = doc(db, TABLE, pretask.id)
    await deleteDoc(xpDocRef);
}

export {
    createPretask,
    getPretask,
    updatePretask,
    addPretask,
    deletePretask,
}