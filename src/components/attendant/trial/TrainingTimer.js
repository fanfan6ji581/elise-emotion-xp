import { Box, Typography } from "@mui/material";
import Countdown from 'react-countdown';

const TrainingTimer = ({ trainingSessionSeconds, onFinish, text }) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const renderer = ({ minutes, seconds, completed }) => {
        return <span>{zeroPad(minutes, 2)}:{zeroPad(seconds, 2)}</span>;
    };

    return (
        <>
            {
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <Typography variant="h6" textAlign="center" sx={{ mr: 3, fontWeight: "bold" }}>
                        {text ? text : "Training time left"}: <Countdown date={Date.now() + trainingSessionSeconds * 1000} renderer={renderer} onComplete={onFinish} />
                    </Typography>
                </Box>
            }
        </>

    )
}

export default TrainingTimer