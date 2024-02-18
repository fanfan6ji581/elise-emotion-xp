import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Radio,
} from "@mui/material";
import { loginAttendant } from "../../slices/attendantSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import db from "../../database/firebase";
import { useEffect, useState } from "react";

const StrategyPage = () => {
  const { alias } = useParams();
  const navigate = useNavigate();
  const loginAttendantS = useSelector(loginAttendant);
  const [strategy, setStrategy] = useState();
  const [attendant, setAttendant] = useState(null);
  const [loadingOpen, setLoadingOpen] = useState(true);

  const fetchAttdendant = async () => {
    const attendantRef = doc(db, "attendant", loginAttendantS.id);
    const docSnap = await getDoc(attendantRef);
    if (!docSnap.exists()) {
      window.alert("Submit failed, Please refresh the page and try again");
    }
    const attendant = docSnap.data();
    setAttendant(attendant);
    setStrategy(attendant.strategy2);
    setLoadingOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoadingOpen(true);
    // if not being set before
    if (!attendant.strategy2) {
      const attendantRef = doc(db, "attendant", loginAttendantS.id);
      await updateDoc(attendantRef, { strategy2: strategy });
    }
    navigate(`/xp/${alias}/payment`);
  };

  useEffect(() => {
    fetchAttdendant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center">
        <Grid item xs={6} sx={{ my: 5 }}>
          <Typography variant="h4" align="center">
            Did you follow your original strategy, and if you did, how well did it work?
          </Typography>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="2"
                  checked={strategy === 1}
                  disabled={attendant && attendant.strategy2 > 0}
                  onChange={() => setStrategy(1)}
                />
                <Typography variant="body1">
                  I didn't use a strategy
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="2"
                  checked={strategy === 2}
                  disabled={attendant && attendant.strategy2 > 0}
                  onChange={() => setStrategy(2)}
                />
                <Typography variant="body1">
                  I generally followed my original strategy and it worked well
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="2"
                  checked={strategy === 3}
                  disabled={attendant && attendant.strategy2 > 0}
                  onChange={() => setStrategy(3)}
                />
                <Typography variant="body1">
                  I generally followed my original strategy and it didn't work so well
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="3"
                  checked={strategy === 4}
                  disabled={attendant && attendant.strategy2 > 0}
                  onChange={() => setStrategy(4)}
                />
                <Typography variant="body1">
                  I significantly changed my strategy during the task and it worked well
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="4"
                  checked={strategy === 5}
                  disabled={attendant && attendant.strateg2 > 0}
                  onChange={() => setStrategy(5)}
                />
                <Typography variant="body1">
                  I significantly changed my strategy during the task and it didn't work so well
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ my: 8 }}>
        <Button
          disabled={!strategy}
          variant="contained"
          size="large"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={() => setLoadingOpen(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default StrategyPage;
