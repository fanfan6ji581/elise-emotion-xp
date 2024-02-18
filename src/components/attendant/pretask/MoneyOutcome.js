import { useDispatch, useSelector } from "react-redux";
import outcome_loss from '../../../assets/outcome_loss.png';
import outcome_profits from '../../../assets/outcome_profits.png';
import { motion } from "framer-motion";
import { Box, Typography, CardMedia, CardContent } from "@mui/material";
import {
    showMoneyOutcome, moneyOutcomeHistory,
    missHistory,
    trialIndex, nextTrial
} from "../../../slices/pretaskSlice";
import { useEffect, useRef } from "react";

export default function MoneyOutcome({ pretask }) {
    const dispatch = useDispatch();
    const loadingInterval = useRef(null);
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const outcomeHistoryS = useSelector(moneyOutcomeHistory);
    const missHistoryS = useSelector(missHistory);
    const trialIndexS = useSelector(trialIndex);
    const { outcomeShowTime } = pretask;

    const moneyEarned = outcomeHistoryS[trialIndexS];
    const missedTrial = missHistoryS[trialIndexS];

    const changeMoneyVariants = {
        left: {
            opacity: [0, 1]
        },
        right: {
            opacity: [1, 0, 1]
        },
        hidden: {
            opacity: 0
        }
    }

    useEffect(() => {
        if (showMoneyOutcomeS) {
            loadingInterval.current = setTimeout(() => {
                dispatch(nextTrial())
            }, outcomeShowTime)
        }

        return () => clearInterval(loadingInterval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showMoneyOutcomeS])


    if (!showMoneyOutcomeS) {
        return <></>
    }

    return (
        <>
            <motion.div variants={changeMoneyVariants} animate={(trialIndexS % 2 === 0) ? "left" : "left"}>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 64, height: 64 }}
                        src={(moneyEarned < 0 || missedTrial) ? outcome_loss : outcome_profits}
                        alt="coins" />
                    <CardContent>
                        <Typography variant="h5" align="center">
                            {
                                missedTrial ?
                                    `Missed trial, you lost -$${-moneyEarned}!` :
                                    moneyEarned < 0 ?
                                        `You just lost $${-moneyEarned}` :
                                        `You just won $${moneyEarned}`
                            }
                        </Typography>
                    </CardContent>
                </Box>
            </motion.div>
        </>
    )
}

