import { Container, Typography } from "@mui/material";
import Countdown from 'react-countdown';

const TrainingTimer = ({ trainingSessionSeconds, onFinish, text }) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const renderer = ({ minutes, seconds, completed }) => {
        return <span>{zeroPad(minutes, 2)}:{zeroPad(seconds, 2)}</span>;
    };

    return (
        <>
            {
                <Container maxWidth="lg" sx={{ mt: 3 }}>
                    <Typography variant="body1" textAlign="center" sx={{ mr: 1 }}>
                        {text ? text : "Training time left"}: <Countdown date={Date.now() + trainingSessionSeconds * 1000} renderer={renderer} onComplete={onFinish} />
                    </Typography>
                </Container>
            }
        </>

    )
}

export default TrainingTimer