import { useParams } from "react-router-dom";
// import { xpConfigS } from "../../slices/gameSlice";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, Grid, Typography} from "@mui/material";
import { Link } from 'react-router-dom';

const QuizPage = () => {
  const { alias } = useParams()
  const navigate = useNavigate();
  // const xpConfig = useSelector(xpConfigS);
  // const [showQuizBtn, setShowQuizBtn] = useState(false);

  const nextPage = () => {
    return navigate(`/xp/${alias}/quiz3`)
  }

  return <>
    <Container maxWidth="lg">
      <Grid container>

        <Grid item xs={12}>
          <Typography textAlign="center" variant="h4" sx={{ my: 5 }}>Do not start the quiz unless instructed by the experimenter.</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box textAlign="center" sx={{ my: 10 }}>
            <Button onClick={nextPage} sx={{ width: 240, padding: 3 }} variant="contained" size="large">Start Quiz</Button>
          </Box>
          <Box textAlign="center" >
            <Button component={Link} to={`/xp/${alias}/instruction-almost-ready-to-start`} sx={{ width: 240, padding: 3 }} variant="outlined" size="large">Prev</Button>
          </Box>
        </Grid>

      </Grid>
    </Container>
  </>
};

export default QuizPage;
