import TrainingTimer from './TrainingTimer';
import BalloonTrial from './BalloonTrial';
import { loginAttendant } from "../../../slices/attendantSlice";
import { xpConfigS } from "../../../slices/gameSlice";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../database/firebase";

const BalloonTrialTrainingPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);
    const xpConfig = useSelector(xpConfigS);
    const { trainingSessionSeconds } = xpConfig;

    const onKeyDown = (e) => {
        if (e.key === ' ') {
            navigate(`/xp/${alias}/instruction-ready`);
        }
        if (e.ctrlKey && e.key === 'm') {
            navigate(`/xp/${alias}/quiz3`);
        }
    }

    const onFinish = async () => {
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        await updateDoc(attendantRef, { isTrained: true });
        navigate(`/xp/${alias}/quiz3`)
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown, false);

        return () => {
            document.removeEventListener("keydown", onKeyDown, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <BalloonTrial isTrainingMode={true} onFinish={onFinish} />
            <TrainingTimer trainingSessionSeconds={trainingSessionSeconds} onFinish={onFinish} />
        </>
    )
}

export default BalloonTrialTrainingPage