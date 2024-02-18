import {
    Container, Typography
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"

const SkipTraining = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    
    const onKeyDown = (e) => {
        if (
            (e.ctrlKey && e.key === 'm') ||
            (e.key === ' ')
        ) {
            navigate(`/xp/${alias}/instruction-ready`);
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown, false);
        return () => document.removeEventListener("keydown", onKeyDown, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" sx={{ py: 5 }}>
                Please wait, the experimenter will come shortly
            </Typography>
        </Container>
    )
}

export default SkipTraining