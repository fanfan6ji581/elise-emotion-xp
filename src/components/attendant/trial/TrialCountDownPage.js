import { useEffect, useState, useRef } from 'react';
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const TrialCountDownPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const [countDown, setCountDown] = useState(10);
    const timerInterval = useRef(null);

    const onStartGame = () => {
        let timer = countDown
        timerInterval.current = setInterval(() => {
            if (timer === 1) {
                navigate(`/xp/${alias}/trial`);
            } else {
                timer--;
                setCountDown(timer);
            }
        }, 1000);
    }

    useEffect(() => {
        onStartGame();
        return () => {
            clearInterval(timerInterval.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Typography variant="h1" align="center" sx={{ pt: 50 }}>
                {countDown}
            </Typography>
        </>
    )
}

export default TrialCountDownPage