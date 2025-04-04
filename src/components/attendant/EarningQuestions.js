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

  const handleTextChange4 = (event) => {
    setAnswers({
      ...answers,
      question4: event.target.value,
    });
  };

  const handleTextChange5 = (event) => {
    setAnswers({
      ...answers,
      question5: event.target.value,
    });
  };

  const questions = [
    {
      label: "Did you follow a strategy during the game?",
      options: [
        "Yes, I had a strategy throughout the game.",
        "Yes, but I found myself greatly deviating from my initial strategy at some point during the game.",
        "Yes, I had a strategy in the beginning but gave up after some trials.",
        "No, I didn’t have a strategy."
      ],
      name: "question1",
    },
    {
      label: "Did you use the indicator chart during the game?",
      options: [
        "Yes, throughout the game.",
        "Yes, but I stopped after some trials.",
        "No.",
        "I don't remember.",
      ],
      name: "question2",
    },
    {
      label: "Did you find the indicator chart useful? (If you did not use the indicator chart, please click NA)",
      options: [
        "Yes",
        "No",
        "NA",
      ],
      name: "question3",
    },
    {
      label: "Please describe your strategy during the game. If applicable, please describe how you used the indicator chart to deal with shifts and aberrations. If you changed your strategy during the game, please tell us a bit more. (If you didn't have a strategy, please click NA) ",
      options: [
        "NA",
      ],
      name: "question4",
    },
    {
      label: "If you think you didn’t give your best performance during the task, please describe any mistakes you have made. (If you are generally satisfied with your performance, please click NA)",
      options: [
        "NA",
      ],
      name: "question5",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{ my: 5 }}>
          <Typography variant="h4" align="center">
            Tell us about your strategy during the task.
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

              {idx === 3 && <>
                <Grid item xs={12} sx={{ my: 1 }}>
                  <FormControl fullWidth>
                    <TextField
                      sx={{ ml: 3 }}
                      fullWidth
                      id="question4"
                      label="Your reply is very important to help us interpret the experimental data so we would be very grateful if you could provide us with some details here 🙏"
                      multiline
                      rows={4}
                      value={answers.question4}
                      onChange={handleTextChange4}
                    />
                  </FormControl>
                </Grid>
              </>}

            </FormControl>
          ))}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                sx={{ ml: 3 }}
                fullWidth
                id="question5"
                label="Your reply is very important to help us interpret the experimental data so we would be very grateful if you could provide us with some details here 🙏"
                multiline
                rows={4}
                value={answers.question5}
                onChange={handleTextChange5}
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
