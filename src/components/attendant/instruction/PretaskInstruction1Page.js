import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  Backdrop,
  CircularProgress
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPretask } from "../../../database/pretask";
import pretaskPreviewImg from "../../../assets/pretask_preview.png";
import demoPretaskVideo from "../../../assets/demo_pretask.mov";

const PretaskInstruction1Page = () => {
  const { alias } = useParams();
  const [pretask, setPretask] = useState(null);
  const [loadingOpen, setLoadingOpen] = useState(true);

  const fetchPretask = async () => {
    setPretask(await getPretask(alias));
    setLoadingOpen(false);
  }

  useEffect(() => {
    fetchPretask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen} >
        <CircularProgress color="inherit" />
      </Backdrop>
      {pretask &&
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" sx={{ my: 5 }}>
                Welcome!
              </Typography>

              <Typography variant="h6" sx={{ mt: 10, mb: 3 }}>
                Thanks for agreeing to participate in the "Financial Forecasting Experiment"! Before you perform the
                main experimental task, we ask you to complete the following task.
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 5 }}>
                You will be paid based on your decisions in the task so please read carefully these instructions and ask the experimenters any clarifying questions.
              </Typography>

              <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                  <Box component="img" alt="" src={pretaskPreviewImg} sx={{ width: '100%', boxShadow: 3 }} />
                </Grid>
                <Grid item xs={6} sx={{ pl: 3 }}>
                  <Typography variant="h6" sx={{ my: 5 }}>
                    On each trial, there is a bucket containing green and blue balls. You see the bucket
                    composition on screen. A ball is randomly
                    drawn from the bucket. You are asked to
                    choose between the following options:
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="h6" sx={{ my: 3 }}>
                        Bet that the ball is blue: a
                        <Typography component="span" variant="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}> winning bet </Typography>
                        will give you <b>${pretask.ballAWin}</b>,
                        a
                        <Typography component="span" variant="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}> losing bet</Typography>,
                        a loss of  <b>${-pretask.ballALose}</b>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="h6" sx={{ my: 3 }}>
                        Bet that the ball is green: a 
                        <Typography component="span" variant="span" sx={{ fontWeight: 'bold', color: 'success.main' }}> winning bet </Typography>
                        will give you <b>${pretask.ballBWin}</b>, a 
                        <Typography component="span" variant="span" sx={{ fontWeight: 'bold', color: 'success.main' }}> losing bet</Typography>, a loss of  <b>${-pretask.ballBLose}</b>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="h6" sx={{ my: 3 }}>
                        Skip: in this case you get  <b>$0</b>
                      </Typography>
                    </li>
                  </ul>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ my: 5 }}>
                Please make sure you reply within the allowed time ({pretask.afkTimeout / 1000} sec), as if
                you don't, you will lose ${-pretask.missLose}, and after {pretask.missLimit} missed trials, the task automatically stops and you
                don't get any earnings.
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                Once you've made your decision, we don't show you the outcome on screen but it is
                recorded and at the end of the game the computer randomly selects {pretask.percentageEarning}% of the trials and you receive your net accumulated outcomes on
                these trials.
              </Typography>

              <Divider />
              <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <video width="100%" controls styles={{ objecFit: 'fill' }}>
                    <source src={demoPretaskVideo} />
                  </video>
                </Grid>
              </Grid>
              <Divider />

              <Typography variant="h6" sx={{ my: 5 }}>
                Please make sure you pay attention throughout the task. Not only you will likely win more
                money if you do so; your choice on each trial will also help us better interpret your behavior
                in the main experimental task.
              </Typography>

              <Typography variant="h6" sx={{ my: 5 }}>
                Good luck!
              </Typography>

              <Box textAlign="center" sx={{ my: 10 }}>
                <Button
                  component={Link}
                  variant="contained"
                  size="large"
                  to={`/xp/${alias}/pretask/training`}
                >
                  Go to Training
                </Button>
              </Box>
            </Grid>
          </Grid>

        </Container>
      }
    </>
  );
};

export default PretaskInstruction1Page;
