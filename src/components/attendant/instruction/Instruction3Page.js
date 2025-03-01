// import YouTube from 'react-youtube';
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
// import { xpConfigS } from "../../../slices/gameSlice";
// import { useSelector } from "react-redux";
import image1 from "../../../assets/1.png";
import img3 from "../../../assets/2025/3.png";
import img8 from "../../../assets/2025/8.png";

const Instruction1Page = () => {
  const { alias } = useParams();
  // const xpConfig = useSelector(xpConfigS);
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3" align="center" sx={{ my: 6 }}>
            Welcome to the Financial Investing Game!
          </Typography>

          <Grid container alignItems="center" sx={{ my: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 3 }}>
                💰 Play well and you could earn over $100! HOWEVER, your success depends entirely on mastering these instructions—every detail is crucial!
              </Typography>
              <Typography variant="h2" sx={{ mt: 6, fontSize: '1.5rem' }}>
                <b>The Asset </b>
              </Typography>
              <Typography variant="h6" sx={{ my: 3 }}>
                This game features a financial asset with daily value fluctuations:
              </Typography>
            </Grid>

            <Grid item xs={2} />
            <Grid item xs={8} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image1} sx={{ boxShadow: 0, width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                <b>+1 = Uptrend</b>: asset value increased that day (see Day #5)
              </Typography>
              <Typography variant="h6" sx={{ my: 1 }}>
                <b>-1 = Downtrend</b>: asset value decreased that day (see Day #10)
              </Typography>
              <Typography variant="h6" sx={{ my: 1 }}>
                The asset typically maintains the same trend for multiple days,
                alternating between uptrend and downtrend regimes (for example, Days #9-18
                show a downtrend; Days #19-26 show an uptrend). However, occasionally,
                you'll spot a one-day rebel—like Day #35's brief uptrend during an overall downtrend—what
                we call an <b>“aberration”</b> (more on these tricksters below).

              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 3 }}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ my: 2 }}><b>💰Game Principles 💰</b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 3 }}>
                Every day, you'll see this interface where you must make a trading decision:
              </Typography>
            </Grid>

            <Grid item xs={1} />
            <Grid item xs={9} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={img3} sx={{ boxShadow: 0, width: '100%' }} />
            </Grid>

            <Grid item xs={12}>
              <ul>
                <li>
                  <Typography variant="h6">
                    📈 <b>BUY</b> (10 shares): <b>WIN $10</b> if the asset trends UP (+1), <b>LOSE $10</b> if it trends DOWN
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6">
                    📉 <b>SELL</b> (10 shares): <b>WIN $10</b> if the asset trends DOWN (-1), <b>LOSE $10</b> if it trends UP
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6">
                    ⏸️ <b>PASS</b>: Always <b>$0</b> outcome (no gain, no loss)
                  </Typography>
                </li>
              </ul>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ my: 2 }}><b>⚠️ High-Stakes Trend Shifts! ⚠️</b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                When the asset trend switches (from downtrend to uptrend or vice versa), all payoffs are multiplied by 10:
              </Typography>

              <Grid item xs={12}>
                <ul>
                  <li>
                    <Typography variant="h6">
                      With <b>Buy</b> or <b>Sell</b>: You will win or lose $100 instead of $10
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="h6">
                      With <b>Pass</b>: Still $0 (no change)
                    </Typography>
                  </li>

                </ul>
              </Grid>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={8} sx={{ textAlign: 'center' }}>
              <Box component="img" alt="" src={img8} sx={{ width: '80%' }} />
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ my: 2 }}><b> Game Flow </b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                You'll make 300 trading decisions (one per day):
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                Make your decision → See your outcome → Next day!
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                The game moves quickly with no breaks between days. Your final payout reflects your
                total accumulated earnings across all 300 trading days. <b>So every decision counts!</b>
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ my: 2 }}><b> Payment Details
              </b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                Out of your 300 trading days, we'll randomly select 100 consecutive days, calculate your net balance—wins minus losses—from those days, and then take a percentage of this total to define your final score.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                <b>Your Payout = your final score - a fixed threshold amount</b>
              </Typography>
            </Grid>
          </Grid>
          <Divider />


          <Grid container alignItems="center" sx={{ my: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ my: 2 }}><b> Any Day Counts!

              </b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                The exact percentage and threshold values will be revealed after you complete the task to ensure you focus on maximizing earnings on every single day: any day could be selected for payment!
              </Typography>
            </Grid>
          </Grid>
          <Divider />

          <Grid container alignItems="center" sx={{ my: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ my: 2 }}><b> Try to Master the Game!
              </b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                Under this payment rule, players who master and apply the optimal strategy are likely to unlock the maximum payout of $100. Those who don't will likely end up with the minimum payment of just $5.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                Also note: During gameplay, you may occasionally encounter brief <b>Math Quiz Breaks</b>. These short pauses are part of our research design and won't disrupt your overall progress in the game.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                ⭐ <b>BONUS ALERT</b>: Answer these math questions correctly and you'll earn up to an extra $20 on top of your final score! ⭐
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 1 }}>
                These quiz breaks may not appear for everyone, but if you see one, it's an opportunity to boost your payment significantly. Complete instructions will be provided at that time.
              </Typography>
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

    </Container >
  );
};

export default Instruction1Page;
