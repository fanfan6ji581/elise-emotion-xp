import { React } from "react";
import { Box, Typography } from '@mui/material';
import { betSkip, updateBet, } from "../../../slices/pretaskSlice";
import { useDispatch, useSelector } from "react-redux";

export default function BallOptionSkip() {
    const dispatch = useDispatch();
    const betSkipS = useSelector(betSkip);

    const onClick = () => {
        // setActive(!active);
        dispatch(updateBet({ type: "skip", value: !betSkipS }));
    }

    return <Box sx={{ px: 0.1, }}>
        <Box className={`card ${betSkipS ? 'cardactive' : ''}`}
            sx={{ py: 1, px: 2 }}
            onClick={() => onClick()}>
            <div style={{
                width: '360px',
                height: '360px',
                borderRadius: '50%',
                background: '#A9A9A9',
                margin: '0 auto',
                padding: '165px 0',
                textAlign: 'center',
                fontSize: 20,
                color: 'white'
            }}>get $0 with certainty</div>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="h5">Skip</Typography>
            </Box>
        </Box>
    </Box>
}
