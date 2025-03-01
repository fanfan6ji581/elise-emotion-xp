import { Provider } from 'react-redux';
import React from 'react';
import './App.css';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { store } from './app/store';
import AdminLayout from "./components/admin/Layout";
import AdminLoginPage from "./components/admin/Login";
import DashboardPage from "./components/admin/DashboardPage";
import ExperimentPage from "./components/admin/ExperimentPage";
import AttendantPage from "./components/admin/AttendantPage";

import AttendantLayout from "./components/attendant/Layout";
import LoginPage from "./components/attendant/LoginPage";
import TrialPage from "./components/attendant/trial/TrialPage";
import TrialTrainingPage from "./components/attendant/trial/TrialTrainingPage";
import TrialHistoryPage from "./components/attendant/trial/TrialHistoryPage";
import CountDownPage from './components/attendant/trial/TrialCountDownPage';
import BreakPage from './components/attendant/trial/TrialBreakPage';
import MathsZoneQuiz from './components/attendant/trial/MathsZoneQuiz';
import MathsAberrQuiz from './components/attendant/trial/MathsAberrQuiz';
import MathsFinalQuiz from './components/attendant/trial/MathsFinalQuiz';
import PaymentPage from "./components/attendant/PaymentPage";
import InstructionPage from "./components/attendant/instruction/InstructionPage";
import Instruction1Page from "./components/attendant/instruction/Instruction1Page";
import Instruction2Page from "./components/attendant/instruction/Instruction2Page";
import Instruction3Page from "./components/attendant/instruction/Instruction3Page";
import InstructionHowToPlayPage from "./components/attendant/instruction/InstructionHowToPlayPage";
import InstructionAlmostReadyToStartPage from "./components/attendant/instruction/InstructionAlmostReadyToStart";
import InstructionPaymentPage from "./components/attendant/instruction/InstructionPaymentPage";
import InstructionReadyPage from "./components/attendant/instruction/InstructionReadyPage";
import InstructionBeforeTrainingStart from "./components/attendant/instruction/InstructionBeforeTrainingStart";
import SkipTrainingPage from "./components/attendant/instruction/SkipTrainingPage";
import QuizPage from "./components/attendant/QuizPage";
import StartQuizPage from "./components/attendant/StartQuizPage";
import Quiz1Page from "./components/attendant/Quiz1Page";
import Quiz2Page from "./components/attendant/Quiz2Page";
import Quiz3Page from "./components/attendant/Quiz3Page";
import StrategyPage from "./components/attendant/StrategyPage";
import StrategyPage2 from "./components/attendant/StrategyPage2";
import EarningQuestions from "./components/attendant/EarningQuestions";
import SignupPage from './components/attendant/SignupPage';
import StartGamePage from './components/attendant/StartGamePage';
import PretaskPage from './components/attendant/pretask/PretaskPage';
import PretaskTrainingPage from './components/attendant/pretask/PretaskTrainingPage';
import PretaskPaymentPage from './components/attendant/pretask/PretaskPaymentPage';
import PretaskInstruction1Page from './components/attendant/instruction/PretaskInstruction1Page';
import StartPretaskPage from './components/attendant/pretask/StartPretaskPage';
import AfterSignupWaitPage from './components/attendant/AfterSignupWaitPage';

const theme = createTheme({
    palette: {
        green: {
            main: '#4caf50', // Example green color
            light: '#81c784', // Example green color
            dark: '#388e3c', // Example green color
            contrastText: '#ffffff',
        },
        black: {
            main: '#242424', 
            light: '#484848',
            dark: '#000000',
            contrastText: '#ffffff',
        },
    },
});

function App() {
    return (
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <BrowserRouter basename="/">
                        <Routes>
                            <Route path="/" element={<AttendantLayout />}>
                                <Route path="xp/:alias/login/:username?/:password?" element={<LoginPage />} />
                                <Route path="xp/:alias/signup" element={<SignupPage />} />
                                <Route path="xp/:alias/signup-wait" element={<AfterSignupWaitPage />} />
                                <Route path="xp/:alias/trial" element={<TrialPage />} />
                                <Route path="xp/:alias/training" element={<TrialTrainingPage />} />
                                <Route path="xp/:alias/payment" element={<PaymentPage />} />
                                <Route path="xp/:alias/instruction" element={<InstructionPage />} />
                                <Route path="xp/:alias/instruction1" element={<Instruction1Page />} />
                                <Route path="xp/:alias/instruction2" element={<Instruction2Page />} />
                                <Route path="xp/:alias/instruction3" element={<Instruction3Page />} />
                                <Route path="xp/:alias/instruction-payment" element={<InstructionPaymentPage />} />
                                <Route path="xp/:alias/instruction-ready" element={<InstructionReadyPage />} />
                                <Route path="xp/:alias/instruction-before-training" element={<InstructionBeforeTrainingStart />} />
                                <Route path="xp/:alias/instruction-how-to-play" element={<InstructionHowToPlayPage />} />
                                <Route path="xp/:alias/instruction-almost-ready-to-start" element={<InstructionAlmostReadyToStartPage />} />
                                <Route path="xp/:alias/skip-training" element={<SkipTrainingPage />} />
                                <Route path="xp/:alias/quiz" element={<QuizPage />} />
                                <Route path="xp/:alias/start-quiz" element={<StartQuizPage />} />
                                <Route path="xp/:alias/quiz1" element={<Quiz1Page />} />
                                <Route path="xp/:alias/quiz2" element={<Quiz2Page />} />
                                <Route path="xp/:alias/quiz3" element={<Quiz3Page />} />
                                <Route path="xp/:alias/strategy" element={<StrategyPage />} />
                                <Route path="xp/:alias/strategy2" element={<StrategyPage2 />} />
                                <Route path="xp/:alias/earning-questions" element={<EarningQuestions />} />
                                <Route path="xp/:alias/count-down" element={<CountDownPage />} />
                                <Route path="xp/:alias/trial-break" element={<BreakPage />} />
                                <Route path="xp/:alias/maths-zone-quiz/:trialIndexParam" element={<MathsZoneQuiz />} />
                                <Route path="xp/:alias/maths-aberr-quiz/:trialIndexParam" element={<MathsAberrQuiz />} />
                                <Route path="xp/:alias/maths-final-quiz" element={<MathsFinalQuiz />} />
                                <Route path="xp/:alias/start-game" element={<StartGamePage />} />
                                <Route path="xp/:alias/trial-history" element={<TrialHistoryPage />} />
                                <Route path="xp/:alias/pretask" element={<PretaskPage />} />
                                <Route path="xp/:alias/pretask/training" element={<PretaskTrainingPage />} />
                                <Route path="xp/:alias/pretask/payment" element={<PretaskPaymentPage />} />
                                <Route path="xp/:alias/pretask/instruction1" element={<PretaskInstruction1Page />} />
                                <Route path="xp/:alias/pretask/start" element={<StartPretaskPage />} />
                            </Route>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route path="login" element={<AdminLoginPage />} />
                                <Route path="dashboard" element={<DashboardPage />} />
                                <Route path="xp/:alias" element={<ExperimentPage />} />
                                <Route path="xp/:alias/attendant/:username" element={<AttendantPage />} />
                            </Route>
                        </Routes>
                        <Outlet />
                    </BrowserRouter>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    );
}

export default App;
