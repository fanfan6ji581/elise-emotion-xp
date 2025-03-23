import { createSlice } from '@reduxjs/toolkit';
import { generateBalloonData } from '../util/xp_data';

const initialState = {
    trialIndex: 0,
    timerProgress: 0,
    progressStartTime: 0,
    showMoneyOutcome: false,
    showAfterClickDelay: false,
    xpConfig: {},
    showVolumeChart: false,
    showVolumeChartInitialValue: false,
    isOutComeShift: 0,

    // internal data
    xpData: {},
    choiceHistory: [],
    outcomeHistory: [],
    missHistory: [],
    reactionHistory: [],
    clickToShowChartHistory: [],
    isTrialBreakTaken: false,
    zoneBreakCount: 0,
    aberrBreakCount: 0,

    mathZoneQuiz: null,
    mathAberrQuiz: null,
    mathFinalQuiz: null,
    showMathZoneQuizIndex: -1,
    showMathAberrQuizIndex: -1,
    showMathZoneQuizPage: false,
    showMathAberrQuizPage: false,
    showMathFinalQuizPage: false,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        recordChoice: (state, action) => {
            const { xpData, xpConfig, trialIndex } = state;
            const { choice, missed } = action.payload;
            let shift = 0;
            let aber = 0;

            // keep mul history
            state.choiceHistory[trialIndex] = choice || "";
            state.missHistory[trialIndex] = missed;
            let money = 0
            if (missed) {
                money = -xpConfig.afkTimeoutCost;
            } else {
                const choiceAmount = parseInt(choice);
                const assetAmount = xpData.asset[trialIndex + 10];
                shift = xpData.shift[trialIndex + 10];
                aber = xpData.aberration[trialIndex + 10];
                money = choiceAmount * assetAmount * xpConfig.magnifyChoice / 10;

                if (shift) {
                    if (money > 0) {
                        money *= xpConfig.winShift;
                    }
                    if (money < 0) {
                        money *= xpConfig.loseShift;
                    }
                }

                if (aber) {
                    money *= xpConfig.aberShift || 1;
                }

            }

            state.outcomeHistory[trialIndex] = money;
            // if (!missed) {
            state.clickToShowChartHistory[trialIndex] = state.showVolumeChart;
            // } else {
            //     state.clickToShowChartHistory[trialIndex] = null;
            // }

            if (!missed) {
                state.reactionHistory[trialIndex] = Date.now() - state.progressStartTime;
            }

            state.showAfterClickDelay = true;
            state.isOutComeShift = shift;

            // should show outcome
            // if (missed || choice !== '0') {
            //     state.showAfterClickDelay = true;
            // } else {
            //     // when click pass
            //     state.timerProgress = 0;
            //     state.trialIndex++;
            //     state.showVolumeChart = state.showVolumeChartInitialValue
            // }
        },
        setShowMoneyOutcome: (state, action) => {
            state.showMoneyOutcome = action.payload;
            // means delay has finished
            state.showAfterClickDelay = false;
        },
        setTimerProgress: (state, action) => {
            state.timerProgress = Math.min(100, action.payload || 0);
        },
        setProgressStartTime: (state, action) => {
            state.progressStartTime = action.payload;
        },
        nextTrial: (state) => {

            const { xpData, xpConfig, trialIndex } = state;
            const volume = xpData.volume[trialIndex + 10 - 1];
            const volumeNext = trialIndex + 10 < xpData.volume.length ? xpData.volume[trialIndex + 10] : -1;
            const aber = xpData.aberration[trialIndex + 10];
            const outcome = state.outcomeHistory[trialIndex];
            const missed = state.missHistory[trialIndex];

            // only trigger when zone ends
            if (volumeNext === 0 && volume === 1) {
                // this means a zone ends
                // check previous choice see if there are any mistake
                let index = trialIndex;
                let zoneHasMistake = false;
                while (xpData.volume[index + 10 - 1] === 1) {
                    let outcome = state.outcomeHistory[index];
                    if (outcome === xpConfig.magnifyChoice ||
                        outcome === -xpConfig.magnifyChoice * xpConfig.loseShift ||
                        outcome === 0) {
                        // if a mistake has found
                        zoneHasMistake = true;
                        break;
                    }
                    index--;
                }

                if (zoneHasMistake) {
                    state.zoneBreakCount++;
                }
            }

            if (!missed) {
                if (state.zoneBreakCount >= (xpConfig.zoneQuizTrigger || 2) && state.showMathZoneQuizIndex === -1) {
                    state.showMathZoneQuizIndex = Math.min(trialIndex + (xpConfig.zoneQuizDelayIndex || 0), xpConfig.numberOfTrials - 1);
                }
            }

            if (xpConfig.showMathsZoneQuiz && !state.mathZoneQuiz &&
                trialIndex === state.showMathZoneQuizIndex) {
                state.showMathZoneQuizPage = true
            }

            if (trialIndex > 0 &&
                aber === 1 && xpData.aberration[trialIndex + 10 - 1] === 1 &&
                outcome !== xpConfig.magnifyChoice * xpConfig.aberShift
            ) {
                state.aberrBreakCount++;
            }

            if (state.aberrBreakCount >= (xpConfig.aberrQuizTrigger || 1) && state.showMathAberrQuizIndex === -1) {
                state.showMathAberrQuizIndex = Math.min(trialIndex + (xpConfig.aberrQuizDelayIndex || 0), xpConfig.numberOfTrials - 1);
            }

            if (xpConfig.showMathsAberrQuiz && !state.mathAberrQuiz &&
                trialIndex === state.showMathAberrQuizIndex) {
                state.showMathAberrQuizPage = true
            }

            if (xpConfig.showFinalMathsQuiz && !state.mathFinalQuiz) {
                // only shows when math zone quiz
                if (trialIndex >= xpConfig.numberOfTrials - 1 && state.zoneBreakCount >= (xpConfig.zoneQuizTrigger || 2)) {
                    state.showMathFinalQuizPage = true
                }
            }

            // original logc
            state.showMoneyOutcome = false;
            state.timerProgress = 0;
            state.trialIndex++;
            state.showVolumeChart = state.showVolumeChartInitialValue
        },
        onLoginTraining: (state, action) => {
            const { xpConfig } = action.payload
            // random generated xpData
            const { xpData } = generateBalloonData(Object.assign({}, xpConfig,
                { numberOfTrials: xpConfig.numberOfTrials }));

            state.xpData = xpData;
            // state.xpData.volume = state.xpData.volume.map(v => v / 100);
            // state.xpConfig = xpConfig;

            // reset
            state.choiceHistory = [];
            state.outcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.clickToShowChartHistory = [];
            state.trialIndex = 0;
            state.timerProgress = 0;
            state.showAfterClickDelay = false;
            state.showMoneyOutcome = false;
            state.showVolumeChartInitialValue = !xpConfig.clickToShowVolumeChart;
            state.showVolumeChart = state.showVolumeChartInitialValue;

            state.zoneBreakCount = 0;
            state.aberrBreakCount = 0;
            state.showMathAberrQuizPage = false;
            state.showMathZoneQuizIndex = -1;
            state.showMathAberrQuizIndex = -1;
            state.showMathZoneQuizPage = false;
            state.showMathFinalQuizPage = false;

        },
        reset: (state) => {
            state.trialIndex = 0;
            state.choiceHistory = [];
            state.outcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.clickToShowChartHistory = [];
            state.showAfterClickDelay = false;
            state.showMoneyOutcome = false;
            state.timerProgress = 0;

            state.zoneBreakCount = 0;
            state.aberrBreakCount = 0;
            state.showMathAberrQuizPage = false;
            state.showMathZoneQuizIndex = -1;
            state.showMathAberrQuizIndex = -1;
            state.showMathZoneQuizPage = false;
            state.showMathFinalQuizPage = false;

        },
        onLogin: (state, action) => {
            const { xpData, xpRecord, xpConfig, mathZoneQuiz, mathAberrQuiz, mathFinalQuiz } = action.payload
            const {
                trialIndex,
                choiceHistory,
                outcomeHistory,
                missHistory,
                reactionHistory,
                clickToShowChartHistory,
                zoneBreakCount,
                aberrBreakCount,
                showMathZoneQuizIndex,
                showMathAberrQuizIndex,
            } = xpRecord;
            state.trialIndex = trialIndex;
            state.choiceHistory = choiceHistory;
            state.outcomeHistory = outcomeHistory;
            state.missHistory = missHistory;
            state.reactionHistory = reactionHistory;
            state.clickToShowChartHistory = clickToShowChartHistory;
            state.zoneBreakCount = zoneBreakCount || 0;
            state.aberrBreakCount = aberrBreakCount || 0;
            state.showMathZoneQuizIndex = showMathZoneQuizIndex || -1;
            state.showMathAberrQuizIndex = showMathAberrQuizIndex || -1;

            state.mathZoneQuiz = mathZoneQuiz;
            state.mathAberrQuiz = mathAberrQuiz;
            state.mathFinalQuiz = mathFinalQuiz;

            state.xpData = xpData;
            state.timerProgress = 0;
            state.showAfterClickDelay = false;
            state.showMoneyOutcome = false;
            state.showVolumeChartInitialValue = !xpConfig.clickToShowVolumeChart;
            state.showVolumeChart = state.showVolumeChartInitialValue
        },
        setXpConfig: (state, action) => {
            state.xpConfig = action.payload
        },
        doShowVolumeChart: (state) => {
            state.showVolumeChart = true
        },
        setIsTrialBreakTaken: (state, action) => {
            state.isTrialBreakTaken = action.payload
        },
        hideShowMathZoneQuizPage: (state) => {
            state.showMathZoneQuizPage = false
        },
        hideShowMathAberrQuizPage: (state) => {
            state.showMathAberrQuizPage = false
        },
        hideShowMathFinalQuizPage: (state) => {
            state.showMathFinalQuizPage = false
        },
    },
});

export const { recordChoice, setProgressStartTime,
    setTimerProgress, nextTrial, onLogin, onLoginTraining,
    setShowMoneyOutcome, reset, setXpConfig, doShowVolumeChart, setIsTrialBreakTaken,
    hideShowMathZoneQuizPage, hideShowMathAberrQuizPage, hideShowMathFinalQuizPage } = gameSlice.actions;

export const trialIndex = (state) => state.game.trialIndex;
export const showVolumeChart = (state) => state.game.showVolumeChart;
export const showVolumeChartInitialValue = (state) => state.game.showVolumeChartInitialValue;
export const showAfterClickDelay = (state) => state.game.showAfterClickDelay;
export const timerProgress = (state) => state.game.timerProgress;
export const showMoneyOutcome = (state) => state.game.showMoneyOutcome;
export const choiceHistory = (state) => state.game.choiceHistory;
export const outcomeHistory = (state) => state.game.outcomeHistory;
export const isOutComeShift = (state) => state.game.isOutComeShift;
export const clickToShowChartHistory = (state) => state.game.clickToShowChartHistory;
export const aberrBreakCount = (state) => state.game.aberrBreakCount;
export const zoneBreakCount = (state) => state.game.zoneBreakCount;

export const showMathZoneQuizPage = (state) => state.game.showMathZoneQuizPage;
export const showMathAberrQuizPage = (state) => state.game.showMathAberrQuizPage;
export const showMathFinalQuizPage = (state) => state.game.showMathFinalQuizPage;
export const showMathZoneQuizIndex = (state) => state.game.showMathZoneQuizIndex;
export const showMathAberrQuizIndex = (state) => state.game.showMathAberrQuizIndex;

export const missHistory = (state) => state.game.missHistory;
export const reactionHistory = (state) => state.game.reactionHistory;
export const xpDataS = (state) => state.game.xpData;
export const xpConfigS = (state) => state.game.xpConfig;
export const isTrialBreakTaken = (state) => state.game.isTrialBreakTaken;

export default gameSlice.reducer;
