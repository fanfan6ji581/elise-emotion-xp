import BalloonTrial from './BalloonTrial';
import { doc, getDoc } from "firebase/firestore";
import db from "../../../database/firebase";
import { useEffect, useState } from 'react';
import { loginAttendant } from "../../../slices/attendantSlice";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const TrialPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);
    const [xp, setXp] = useState(null);

    const fetchXP = async () => {
        const xpRef = doc(db, "xp", loginAttendantS.xp_id);
        const docSnap = await getDoc(xpRef);
        if (docSnap.exists()) {
            setXp(docSnap.data());
        }
    }

    const onFinish = () => {
        navigate(`/xp/${alias}/earning-questions`)
    }

    useEffect(() => {
        fetchXP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {
                xp && !xp.enablePlaying &&
                <Typography variant="h5" align="center" sx={{ my: 5 }}>Waiting for experimenter to enable the game.</Typography>
            }

            {
                xp && xp.enablePlaying &&
                <BalloonTrial onFinish={onFinish} />
            }
        </>
    )
}

export default TrialPage