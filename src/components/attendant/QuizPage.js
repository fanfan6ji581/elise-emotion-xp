import { useParams } from "react-router-dom";
import { xpConfigS } from "../../slices/gameSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Grid, } from "@mui/material";
import { Link } from 'react-router-dom';

const QuizPage = () => {
  const { alias } = useParams()
  const navigate = useNavigate();
  const xpConfig = useSelector(xpConfigS);
  const [showQuizBtn, setShowQuizBtn] = useState(false);

  const nextPage = () => {
    if (xpConfig) {
      switch (xpConfig.treatment) {
        case 3:
          return navigate(`/xp/${alias}/quiz3`)
        case 2:
          return navigate(`/xp/${alias}/quiz2`)
        case 1:
        default:
          return navigate(`/xp/${alias}/quiz1`)
      }
    }
  }

  const onKeyDown = (e) => {
    if (
      (e.ctrlKey && e.key === 'm') ||
      e.key === ' '
    ) {
      setShowQuizBtn(true);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);
    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    }
    // eslint-disable-next-line
  }, [])

  return <>
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <Typography textAlign="center" variant="h4" sx={{ my: 5 }}>Please wait for further instructions from the experimenters.</Typography>
        </Grid>


        <Grid item xs={12}>
          {showQuizBtn &&
            <Box textAlign="center" sx={{ my: 10 }}>
              <Button onClick={nextPage} sx={{ width: 240, padding: 3 }} variant="contained" size="large">Start Quiz</Button>
            </Box>
          }
          <Box textAlign="center" >
            <Button component={Link} to={`/xp/${alias}/instruction-ready`} sx={{ width: 240, padding: 3 }} variant="outlined" size="large">Prev</Button>
          </Box>
        </Grid>

      </Grid>
    </Container>
  </>
};

export default QuizPage;
