import {
    Container, Typography, Button, Box, Backdrop, CircularProgress
} from "@mui/material";
import { Link, useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { getPretask } from "../../../database/pretask";
import { useNavigate } from "react-router-dom"

const StartPretaskPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [pretask, setPretask] = useState(null);
    const [startCountDown, setStartCountDown] = useState(false);
    const [countDown, setCountDown] = useState(10);
    const timerInterval = useRef(null);

    const fetchPretask = async () => {
        setPretask(await getPretask(alias));
        setLoadingOpen(false);
    }

    const onStartGame = () => {
        setStartCountDown(true);
        let timer = countDown
        timerInterval.current = setInterval(() => {
            if (timer === 1) {
                navigate(`/xp/${alias}/pretask`);
            } else {
                timer--;
                setCountDown(timer);
            }
        }, 1000);
    }

    useEffect(() => {
        fetchPretask()
        return () => {
            clearInterval(timerInterval.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="md">
                {!startCountDown &&
                    <>
                        <Typography variant="h4" align="center" sx={{ py: 5 }}>
                            Ready to Start?
                        </Typography>

                        <Box textAlign="center" sx={{ py: 15 }}>
                            <Button variant="contained" size="large"
                                onClick={onStartGame}
                                disabled={!pretask || !pretask.enablePretaskPlaying}
                                sx={{ m: 3, width: 300 }}
                            >Start Game</Button>

                            <br />

                            <Button component={Link} variant="outlined" size="large"
                                to={`/xp/${alias}/pretask/instruction1`}
                                sx={{ m: 3, width: 300 }}
                            >Back to instruction</Button>
                            {
                                pretask && !pretask.enablePretaskPlaying &&
                                <Typography variant="h6" align="center" sx={{ my: 5 }}>Waiting for experimenter to enable the game.</Typography>
                            }
                        </Box>
                    </>
                }

                {startCountDown &&
                    <Typography variant="h1" align="center" sx={{ pt: 50 }}>
                        {countDown}
                    </Typography>
                }
            </Container>
        </>

    )
}

export default StartPretaskPage