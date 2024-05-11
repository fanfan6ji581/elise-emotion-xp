import YouTube from 'react-youtube';
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
import image2 from "../../../assets/2.png";
import image10 from "../../../assets/10.png";
import image11 from "../../../assets/11.png";

const Instruction1Page = () => {
  const { alias } = useParams();
  // const xpConfig = useSelector(xpConfigS);
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" sx={{ my: 5 }}>
            Welcome to the Financial Investing Game!
          </Typography>

          <Grid container alignItems="center" sx={{ my: 5 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 3 }}>
                If you play well you can earn a lot of money in this game (up to $100), so please read the following instructions very carefully.
              </Typography>
              <Typography variant="h6" sx={{ my: 3 }}>
                In this game, there is a financial asset whose value fluctuates every day. Some days the value increases, some days it decreases, like this for example:
              </Typography>
            </Grid>

            <Grid item xs={2} />
            <Grid item xs={8} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image1} sx={{ boxShadow: 0, width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 3 }}>
                A value of “<b>+1</b>” for a given day indicates an <i>uptrend</i> : asset value has <i>increased</i> on that day (e.g, see Day # 5). A value “<b>-1</b>” indicates a <i>downtrend</i>: asset value has <i>decreased</i> on that day (e.g., Day # 10).
              </Typography>
              <Typography variant="h6" sx={{ my: 3 }}>
                As you can see on the graph, the trend of the asset usually remains the same for several days,
                meaning the asset alternates between uptrend phases and downtrend phases. For example,
                from Day #9 to Day #18, the asset features a downtrend. Then on Day #19 a shift occurs and
                from Day #19 to Day #26, the asset features an uptrend. However, occasionally, the trend
                changes for only one day and then returns to its current level. For example, on Day #35, the
                asset switches to an uptrend but only for that day and then it switches back to the current
                downtrend. Thus, this is not a real shift but an “<i>aberration</i>”, more below.
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 5 }}>
            <Grid item xs={12}>
              <Typography variant="h5"><b>Principle of the Game</b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 3 }}>
                Your job is to decide whether to take a position—either buy or sell—in the asset in each of
                300 days, so you will be playing 300 trials overall (1 trial = 1 day). If you do not want to take
                position in the asset, you should choose to pass, which guarantees you to get $0 (i.e., you
                cannot lose any money, but you cannot win money either).
              </Typography>
              <Typography variant="h6" >
                If you choose to take position in the asset on a given day, you win money if:
              </Typography>
              <ul>
                <li>
                  <Typography variant="h6">
                    You choose to buy the asset, and then the asset features an uptrend (+1);
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6">
                    You choose to sell the asset, and then the asset features a downtrend (-1).
                  </Typography>
                </li>
              </ul>
              <Typography variant="h6">
                You lose money otherwise. How much money is lost or won depends on the size of your position, see next. 😊
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 5 }}>
            <Grid item xs={12}>
              <Typography variant="h5"><b>Your Payoff</b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 3 }}>
                When you decide to buy the asset on a given day, you tell the computer whether you want to
                buy 1 share or 2 shares; likewise in case of a sell decision: you tell the computer how many
                shares you want to sell. The action set looks like this on the user interface (you simply click
                on your chosen option on each trial):
              </Typography>

            </Grid>
            <Grid item xs={1} />
            <Grid item xs={10} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image2} sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 3 }}>
                The outcome on each trial, in case of a buy/sell decision is:
              </Typography>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Box component="img" alt="" src={image10} sx={{ width: '80%' }} />
              </Grid>

              <Typography variant="h6" sx={{ my: 3 }}>
                That is, you win if your position (“+” for buy, “-” for sell) matches the trend realised on the next day.
              </Typography>
              <Typography variant="h6" sx={{ my: 3 }}>
                This is for normal days. <b>When a shift occurs, the payoff is</b>
                <Typography sx={{ color: 'error.main', fontSize: '1.25em' }} component="span"><b> magnified </b></Typography>
                <b> by 20 times as  follows:</b>
              </Typography>

              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Box component="img" alt="" src={image11} sx={{ width: '80%' }} />
              </Grid>

              <Typography variant="h6" sx={{ my: 3 }}>
                What this means is that if you take a position on a shift day, you will win or lose $20 per
                share you traded. In other words, your outcome will be magnified by 20 times.
              </Typography>

              <Typography variant="h6" sx={{ my: 3 }}>
                After you’ve made your decision on a given day, you see the realization of the asset trend on
                the next day, and your corresponding outcome. Then you proceed immediately to the next
                trial (no break). The computer records all the outcomes you got across trials and your final
                earnings directly reflect your net accumulated outcomes in the game, so you should really try
                to do your best on each trial, as you can potentially earn very significant earnings (more
                details below).
              </Typography>

            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 5 }}>
            <Grid item xs={12}>
              <Typography variant="h5"><b>Here is how to play the game in practice:</b></Typography>
            </Grid>
            <Grid item xs={12} sx={{ my: 5, textAlign: "center" }}>
              {/* Embed YouTube Video */}
              <YouTube videoId="tGzIT6gMJIc" opts={{
                height: '640', // Adjust the video height as needed
                width: '80%',  // Adjust the video width as needed
                playerVars: {
                  autoplay: 0,  // Use 1 to autoplay the video
                  // You can add more player variables here as needed
                  modestbranding: 1, // This limits YouTube branding
                },
              }}
                onReady={(event) => {
                  // Attempt to set the video quality
                  event.target.setPlaybackQuality('hd720'); // This is just an example
                }}
              />
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
