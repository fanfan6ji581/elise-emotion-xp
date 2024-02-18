import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { xpConfigS } from "../../../slices/gameSlice";
import { useSelector } from "react-redux";
import image1 from "../../../assets/image1.png";
import image4 from "../../../assets/image4.png";
import image8 from "../../../assets/image8.png";

const Instruction1Page = () => {
  const { alias } = useParams();
  const xpConfig = useSelector(xpConfigS);
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" sx={{ my: 5 }}>
            Welcome to the Financial Forecasting Game!
          </Typography>

          <Grid container alignItems="center" sx={{ my: 5 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 5 }}>
                If you play well you can earn a lot of money in this game (up to $100 AUD), so please read the
                following instructions very carefully and ask any clarifying questions to the experimenter.
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                In the game, there is a financial asset that randomly switches between 2 states, say <b>high</b> and <b>low</b>.
              </Typography>
            </Grid>

            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image1} sx={{ boxShadow: 0, width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                There are two types of switches. Some of the switches are "<b>regime shifts</b>": they usually last for several days, as shown in the picture. Others are <b>"aberrations"</b>: the value switches back immediately (see for example, trial 18).
              </Typography>
            </Grid>

          </Grid>
          <Divider />

          <Grid container alignItems="center" sx={{ my: 10 }}>

            <Grid item xs={8} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image8} sx={{ width: '100%', boxShadow: 3 }} />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" sx={{ ml: 5 }}>
                At the beginning of the game, you'll see what's happened with the asset in the last 100 days.
              </Typography>
              <Typography variant="h6" sx={{ mt: 5, ml: 5 }}>
                You will also be shown the history for a volume indicator over the same period.
                This kind of indicator is commonly present on trading screens in the real world.
              </Typography>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Box sx={{ mt: 3, border: 1, p: 2, boxShadow: 3 }}>
                <Typography variant="h5" >
                  We are showing you this because your job is to <b>forecast</b> in real time on each of {xpConfig.numberOfTrials} trials
                  whether a switch is going to occur over the next day, and <b>there is a pattern linking the volume indicator to the regime shifts.</b>

                  <br />
                  <br />
                  If you manage to identify what the pattern is, you may track the value of the volume indicator to forecast the regime shifts by differentiating them from aberrations, which can greatly improve your performance.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image4} sx={{ boxShadow: 3, width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
              <ul>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    If you forecast no switch and turn out to be right, you win $1,
                    but if you're wrong (that is, a switch happens), you lose $3.
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    If you forecast a switch and turn out to be right, you win $3, but if you're wrong (that is, no switch happens), you lose $1.
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    If you choose to skip, you get $0 (i.e., you don't earn any money but cannot lose either.)
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    Please remember this payoff rule. You can also write it down.
                  </Typography>
                </li>
              </ul>
            </Grid>
          </Grid>

          <Box textAlign="center" sx={{ my: 10 }}>
            <Button
              component={Link}
              variant="contained"
              size="large"
              to={`/xp/${alias}/instruction-how-to-play`}
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>

    </Container>
  );
};

export default Instruction1Page;
