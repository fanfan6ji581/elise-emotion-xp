import { React } from "react";
import { Box, Typography } from '@mui/material';
import BallOptionChart from "./BallOptionChart"
import { Global, css } from '@emotion/react'
import { betA, betB, updateBet, } from "../../../slices/pretaskSlice";
import { useDispatch, useSelector } from "react-redux";

export default function BallOption({ type, winQty, lossQty, winCash, lossCash, label }) {
    const dispatch = useDispatch();
    const betAS = useSelector(betA);
    const betBS = useSelector(betB);

    const onClick = () => {
        dispatch(updateBet({
            type,
            value: type === 'a' ? !betAS : !betBS
        }));
    }

    return <>
        <Global
            styles={css`
                .card {
                    background-color: #fff;
                    cursor: pointer;
                }
                .card:hover {
                    background-color: rgba(229, 228, 226, 0.4);
                }
                .card.cardactive {
                    background-color: rgba(100, 149, 237, 0.25);
                }
            `}
        />

        <Box sx={{ px: 0.1 }}>
            <Box
                sx={{ py: 1, px: 2 }}
                className={`card ${(type === 'a' ? betAS : betBS) ? 'cardactive' : ''}`} onClick={() => onClick()}>
                <BallOptionChart
                    type={type}
                    winQty={winQty}
                    lossQty={lossQty}
                    winCash={winCash}
                    lossCash={lossCash}
                />

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="h5">{label}</Typography>
                </Box>
            </Box>
        </Box>
    </>
}
