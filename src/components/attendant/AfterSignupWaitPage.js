import {
    Container, Typography, Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { loginAttendant, login } from "../../slices/attendantSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAttendant } from '../../database/attendant';
import { getXp } from "../../database/xp";

const StartGamePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { alias } = useParams();
    const loginAttendantS = useSelector(loginAttendant);
    const [xp, setXp] = useState(null);

    const fetchData = async () => {
        const refreshedAttendant = await getAttendant(loginAttendantS.id);
        // update login attendant in the local storage and store
        dispatch(login(refreshedAttendant));

        const xpConfig = await getXp(alias)
        setXp(xpConfig);

        if (xpConfig.enableSignUpContinue && refreshedAttendant.xpData && refreshedAttendant.dataId) {
            navigate(`/xp/${alias}/instruction`)
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" sx={{ py: 5 }}>
                Sign up successfully!
            </Typography>


            <Box textAlign="center" >
                {
                    xp && !xp.enableSignUpContinue &&
                    <>

                        <Typography variant="h6" align="center" sx={{ pt: 10, pb: 3 }}>
                            Please waiting for experimenter to enable the game play.
                        </Typography>
                        <Typography variant="h6" align="center" >
                            Once enabled, you can refresh this page to continue
                        </Typography>
                    </>
                }
                {
                    xp && xp.enableSignUpContinue && !loginAttendantS?.xpData &&
                    <>

                        <Typography variant="h6" align="center" sx={{ pt: 10, pb: 3 }}>
                            Please contact experimenter to assign a data series.
                        </Typography>
                    </>
                }
            </Box>
        </Container>
    )
}

export default StartGamePage