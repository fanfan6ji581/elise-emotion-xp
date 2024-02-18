import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  FormControl,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { loginAttendant } from "../../slices/attendantSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAttendant, updateAttendant } from '../../database/attendant';

const EarningQuestionPage = () => {
  const { alias } = useParams();
  const navigate = useNavigate();
  const loginAttendantS = useSelector(loginAttendant);
  const [attendant, setAttendant] = useState(null);
  const [loadingOpen, setLoadingOpen] = useState(true);
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });
  const allQuestionsAnswered = Object.values(answers).every((answer) => answer !== '');

  const fetchAttendant = async () => {
    const attendant = await getAttendant(loginAttendantS.id);
    setAttendant(attendant);
    if (attendant.earningQuiz) {
      setAnswers(attendant.earningQuiz)
    }
    setLoadingOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoadingOpen(true);
    // if not being set before
    if (!attendant.answers) {
      await updateAttendant(loginAttendantS.id, { earningQuiz: answers });
    }
    navigate(`/xp/${alias}/payment`);
  };

  useEffect(() => {
    fetchAttendant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRadioChange = (event) => {
    setAnswers({
      ...answers,
      [event.target.name]: event.target.value,
    });
  };

  const handleTextChange = (event) => {
    setAnswers({
      ...answers,
      question5: event.target.value,
    });
  };

  const questions = [
    {
      label: "Did you follow a clear strategy during the game?",
      options: [
        "Yes, I have a clear strategy throughout the game.",
        "Yes, but I gave up after some trials.",
        "No",
      ],
      name: "question1",
    },
    {
      label: "Assuming you did follow a clear strategy (if not, please click NA), does that strategy match the strategy you had in mind when you started the game?",
      options: [
        "Yes",
        "No",
        "I didn't have a strategy when I started the game.",
        "NA",
      ],
      name: "question2",
    },
    {
      label: "Did you use the volume chart during the game?",
      options: [
        "Yes, throughout the game.",
        "Yes, but I stopped after some trials.",
        "No",
        "I don't remember.",
      ],
      name: "question3",
    },
    {
      label: "Did you find the volume chart useful? (If you did not use the volume chart, please click NA)",
      options: [
        "Yes",
        "No",
        "NA",
      ],
      name: "question4",
    },
    {
      label: "If applicable, please describe how you used the volume chart to make forecasts.",
      options: [
        "NA",
      ],
      name: "question5",
    },
  ];

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
          {questions.map((question, idx) => (
            <FormControl component="fieldset" key={idx} sx={{ my: 3 }}>
              <Typography variant="h6">{idx + 1}. {question.label}</Typography>
              <RadioGroup
                name={question.name}
                value={answers[question.name]}
                onChange={handleRadioChange}
                sx={{ ml: 3 }}
              >
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ))}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                sx={{ ml: 3 }}
                fullWidth
                id="question5"
                label="If applicable, please describe how you used the volume chart to make forecasts."
                multiline
                rows={4}
                value={answers.question5}
                onChange={handleTextChange}
              />
            </FormControl>
          </Grid>

        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ my: 8 }}>
        <Button
          disabled={!allQuestionsAnswered}
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

export default EarningQuestionPage;
