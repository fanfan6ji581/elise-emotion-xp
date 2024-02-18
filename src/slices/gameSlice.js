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

    // internal data
    xpData: {},
    choiceHistory: [],
    outcomeHistory: [],
    missHistory: [],
    reactionHistory: [],
    clickToShowChartHistory: [],
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        recordChoice: (state, action) => {
            const { xpData, xpConfig, trialIndex } = state;
            const { choice, missed } = action.payload;

            // keep mul history
            state.choiceHistory[trialIndex] = choice || "";
            state.missHistory[trialIndex] = missed;
            console.log(`recordChoice has trialIndex: ${trialIndex}, xpData.shift[${trialIndex + 2}]: ${xpData.shift[trialIndex + 2]}`)
            const isShift = xpData.shift[trialIndex + 1];
            let money = 0
            if (missed) {
                money = -xpConfig.afkTimeoutCost;
            } else {
                switch (choice) {
                    case "shift":
                        money = isShift ? 3 : -1;
                        break;
                    case "no shift":
                        money = !isShift ? 1 : -3;
                        break;
                    case "skip":
                    default:
                        money = 0;
                        break;
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

            // should show outcome
            if (missed || choice !== 'skip') {
                state.showAfterClickDelay = true;
            } else {
                // when click pass
                state.timerProgress = 0;
                state.trialIndex++;
                state.showVolumeChart = state.showVolumeChartInitialValue
            }
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
            state.showMoneyOutcome = false;
            state.timerProgress = 0;
            state.trialIndex++;
            state.showVolumeChart = state.showVolumeChartInitialValue
        },
        onLoginTraining: (state, action) => {
            const { xpConfig } = action.payload
            // random generated xpData
            const { xpData } = generateBalloonData(Object.assign({}, xpConfig,
                { numberOfTrials: xpConfig.numberOfTrials + 100 }));

            state.xpData = xpData;
            state.xpData.balloonSpeed = state.xpData.balloonSpeed.map(v => v / 100);
            state.xpData.volume = state.xpData.volume.map(v => v / 100);
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
            state.showVolumeChart = state.showVolumeChartInitialValue
        },
        reset: (state) => {
            state.trialIndex = -1;
            state.choiceHistory = [];
            state.outcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.clickToShowChartHistory = [];
            state.showAfterClickDelay = false;
            state.showMoneyOutcome = false;
            state.timerProgress = 0;
        },
        onLogin: (state, action) => {
            const { xpData, xpRecord, xpConfig } = action.payload
            const {
                trialIndex,
                choiceHistory,
                outcomeHistory,
                missHistory,
                reactionHistory,
                clickToShowChartHistory
            } = xpRecord;
            state.trialIndex = trialIndex + 1;
            state.choiceHistory = choiceHistory;
            state.outcomeHistory = outcomeHistory;
            state.missHistory = missHistory;
            state.reactionHistory = reactionHistory;
            state.clickToShowChartHistory = clickToShowChartHistory;
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
        }
    },
});

export const { recordChoice, setProgressStartTime,
    setTimerProgress, nextTrial, onLogin, onLoginTraining,
    setShowMoneyOutcome, reset, setXpConfig, doShowVolumeChart } = gameSlice.actions;

export const trialIndex = (state) => state.game.trialIndex;
export const showVolumeChart = (state) => state.game.showVolumeChart;
export const showVolumeChartInitialValue = (state) => state.game.showVolumeChartInitialValue;
export const showAfterClickDelay = (state) => state.game.showAfterClickDelay;
export const timerProgress = (state) => state.game.timerProgress;
export const showMoneyOutcome = (state) => state.game.showMoneyOutcome;
export const choiceHistory = (state) => state.game.choiceHistory;
export const outcomeHistory = (state) => state.game.outcomeHistory;
export const clickToShowChartHistory = (state) => state.game.clickToShowChartHistory;
export const missHistory = (state) => state.game.missHistory;
export const reactionHistory = (state) => state.game.reactionHistory;
export const xpDataS = (state) => state.game.xpData;
export const xpConfigS = (state) => state.game.xpConfig;

export default gameSlice.reducer;
