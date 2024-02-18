import { Button, Grid, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Xarrow from 'react-xarrows';
import {
    showMoneyOutcome, recordChoice, setShowMoneyOutcome, showAfterClickDelay,
    choiceHistory
} from "../../../slices/gameSlice";
import { useEffect, useRef, useState } from 'react';

export default function Choice({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const showAfterClickDelayS = useSelector(showAfterClickDelay);
    const choiceHistoryS = useSelector(choiceHistory);
    const loadingInterval = useRef(null);
    const { choiceDelay } = xpConfig;
    const [choice, setChoice] = useState('')

    const clickedAction = (choice) => {
        setChoice(choice);
        dispatch(recordChoice({ choice, missed: false }));
    }

    useEffect(() => {
        if (showAfterClickDelayS) {
            loadingInterval.current = setTimeout(() => {
                dispatch(setShowMoneyOutcome(true));
            }, choiceDelay)
        }

        // missed
        const filterd = choiceHistoryS.filter(i => i != null);
        if (filterd[filterd.length - 1] === '') {
            setChoice('');
        }

        return () => clearInterval(loadingInterval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAfterClickDelayS, showMoneyOutcomeS, choiceHistoryS])


    return (
        <>
            <Grid container sx={{ my: 5 }}>
                <Grid item xs={12} sx={{ mb: 4, textAlign: "center" }} >
                    {/* <Button size="large" variant="outlined" sx={{ mx: 22, width: 100 }} id="sell">
                        Sell
                    </Button>
                    <Button size="large" variant="outlined" sx={{ mx: 22, width: 100 }} id="buy">
                        Buy
                    </Button> */}
                    <Box id="sell" sx={{
                        display: 'inline-block',
                        mx: 27,
                        width: 100,
                        height: 40,
                        bgcolor: 'primary.main',
                        color: 'white',
                        border: 1,
                        borderRadius: '4px',
                        textAlign: 'center',
                        lineHeight: '40px', // Align text vertically
                    }}>
                        Sell
                    </Box>
                    <Box id="buy" sx={{
                        display: 'inline-block',
                        mx: 27,
                        width: 100,
                        height: 40,
                        bgcolor: 'primary.main',
                        color: 'white',
                        border: 1,
                        borderRadius: '4px',
                        textAlign: 'center',
                        lineHeight: '40px', // Align text vertically
                    }}>
                        Buy
                    </Box>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    {['-20', '-10', '0', '10', '20'].map((val, index) => (
                        <Button key={val} size="large" variant="contained" sx={{ mx: 5, width: 100 }} onClick={() => clickedAction(val)}
                            disabled={choice !== val && (showAfterClickDelayS || showMoneyOutcomeS)}
                            id={`choice${val}`}
                        >
                            {val !== '0' ? val : 'Pass'}
                        </Button>
                    ))}
                </Grid>
            </Grid>

            <Xarrow start="sell" end="choice-20" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} />
            <Xarrow start="sell" end="choice-10" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} />
            <Xarrow start="buy" end="choice10" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} />
            <Xarrow start="buy" end="choice20" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} />

        </>
    )
}