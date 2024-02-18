import { createSlice, current } from '@reduxjs/toolkit';
import * as _ from "lodash";

function isBet(bet, expected) {
    return _.isEqual(_.sortBy(bet), _.sortBy(expected))
}

function isLastBet(betHistory, expected) {
    return isBet(betHistory[betHistory.length - 1], expected)
}

function isLastBetEither(betHistory, expectedValues) {
    for (let expected of expectedValues) {
        if (isLastBet(betHistory, expected)) {
            return true
        }
    }
    return false;
}

function filterOutMissed(betHistory) {
    return _.filter(
        _.filter(betHistory, bet => bet.length > 0),
        bet => !(bet.length === 1 && bet[0] === '')
    );
}

function isAllSkip(betHistory) {
    for (let bets of betHistory) {
        if (!isBet(bets, ["skip"])) {
            return false;
        }
    }
    return true;
}

function isAllG(betHistory) {
    for (let bets of betHistory) {
        if (!isBet(bets, ["b"])) {
            return false;
        }
    }
    return true;
}


const isLastBorBS = betHistory => isLastBetEither(betHistory, [["a"], ["a", "skip"]])
const isLastGorGS = betHistory => isLastBetEither(betHistory, [["b"], ["b", "skip"]])
const isLastSorGS = betHistory => isLastBetEither(betHistory, [["skip"], ["b", "skip"]])
const isLastBG = betHistory => isLastBet(betHistory, ["b", "a"])
const isLastGS = betHistory => isLastBet(betHistory, ["b", "skip"])
const isLastB = betHistory => isLastBet(betHistory, ["a"])
const isLastG = betHistory => isLastBet(betHistory, ["b"])

const is_AllS_BorBS = betHistory => betHistory.length >= 2 &&
    isLastBorBS(betHistory) &&
    isAllSkip(_.slice(betHistory, 0, betHistory.length - 1));

const is_AllS_BorBS_B = betHistory => betHistory.length >= 3 &&
    isLastBet(betHistory, ["a"]) &&
    is_AllS_BorBS(_.slice(betHistory, 0, betHistory.length - 1));

const is_OptionalAllS_hasB = betHistory => isLastBetEither(betHistory, [["a"], ["a", "b"], ["a", "skip"]]) &&
    (betHistory.length === 1 ||
        isAllSkip(_.slice(betHistory, 0, betHistory.length - 1)));

const is_OptionalAllS_hasB_B = betHistory =>
    isLastBetEither(betHistory, [["a"]]) &&
    is_OptionalAllS_hasB(_.slice(betHistory, betHistory.length - 1));


const is_AllS_GorGS = betHistory => betHistory.length >= 2 &&
    isLastGorGS(betHistory) &&
    isAllSkip(_.slice(betHistory, 0, betHistory.length - 1));

const is_AllS_GorGS_G = betHistory => betHistory.length >= 3 &&
    isLastBet(betHistory, ["b"]) &&
    is_AllS_GorGS(_.slice(betHistory, 0, betHistory.length - 1));

const is_GS_G = betHistory => betHistory.length === 2 &&
    isLastBet(betHistory, ["b"]) &&
    isLastGS(_.slice(betHistory, 0, betHistory.length - 1))

const is_G_AllG = betHistory => betHistory.length >= 2 && isAllG(betHistory);
const is_G_AllG_hasB = betHistory => betHistory.length >= 3 &&
    isLastBetEither(betHistory, [["a"], ["a", "b"], ["a", "skip"]]) &&
    is_G_AllG(_.slice(betHistory, 0, betHistory.length - 1));
const is_G_AllG_hasB_B = betHistory => betHistory.length >= 4 &&
    isLastB(betHistory) &&
    is_G_AllG_hasB(_.slice(betHistory, 0, betHistory.length - 1));

const is_G_AllG_GSorS = betHistory => betHistory.length >= 3 &&
    isLastSorGS(betHistory) &&
    is_G_AllG(_.slice(betHistory, 0, betHistory.length - 1));


// #1 case first half
function isCase1FirstHalf(betHistory, state) {
    if (isAllSkip(betHistory)) {
        return { result: true, diff: state.pretask.x }
    }

    if (is_AllS_BorBS(betHistory)) {
        return { result: true, diff: state.pretask.x }
    }

    if (is_AllS_BorBS_B(betHistory)) {
        return { result: true, val: state.pretask.ballAQty - state.pretask.x }
    }

    return { result: false };
}

function findIdxFor_is_AllS_hasB_B(fullBetHistory) {
    for (let i = 2; i < fullBetHistory.length; i++) {
        let betHistory = _.slice(fullBetHistory, 0, i);
        if (is_AllS_BorBS_B(betHistory)) {
            return i;
        }
    }
    return -1;
}

// #1 case 2nd half
function isCase1SecondHalf(betHistory, state) {
    // check if it cantains #1 case first half
    const idx = findIdxFor_is_AllS_hasB_B(betHistory);
    if (idx === -1) {
        return { result: false }
    }
    const restBetHistory = _.slice(betHistory, idx);
    if (isAllSkip(restBetHistory)) {
        return { result: true, diff: -state.pretask.x }
    }

    if (restBetHistory.length === 1 && isLastGorGS(restBetHistory)) {
        return { result: true, diff: -state.pretask.x }
    }

    if (is_AllS_GorGS(restBetHistory)) {
        return { result: true, diff: -state.pretask.x }
    }

    if (is_AllS_GorGS_G(restBetHistory)) {
        return { result: true, finish: true }
    }

    return { result: false }
}

// #2 case
function isCase2First(betHistory, state) {
    if (betHistory.length === 1 && isLastBG(betHistory)) {
        return { result: true, diff: -state.pretask.x }
    }

    if (betHistory.length === 2 &&
        isLastBet(betHistory, ["b"]) &&
        isLastBG(_.slice(betHistory, 0, betHistory.length - 1))
    ) {
        return { result: true, val: state.pretask.ballAQty + state.pretask.x }
    }

    if (betHistory.length === 3 &&
        isLastBet(betHistory, ["a"]) &&
        isLastBet(_.slice(betHistory, 0, betHistory.length - 1), ["b"]) &&
        isLastBG(_.slice(betHistory, 0, betHistory.length - 2))
    ) {
        return { result: true, finish: true }
    }

    return { result: false }
}

function isCase2Second(betHistory, state) {
    if (betHistory.length === 1 && isLastGS(betHistory)) {
        return { result: true, diff: -state.pretask.x }
    }

    if (is_GS_G(betHistory)) {
        return { result: true, val: state.pretask.ballAQty + state.pretask.x }
    }

    if (betHistory.length >= 3 &&
        is_GS_G(_.slice(betHistory, 0, 2))
    ) {
        const restBetHistory = _.slice(betHistory, 2);
        if (restBetHistory.length === 1 && isLastBorBS(restBetHistory)) {
            return { result: true, diff: state.pretask.x }
        }
        if (isAllSkip(restBetHistory)) {
            return { result: true, diff: state.pretask.x }
        }
        if (is_AllS_BorBS(restBetHistory)) {
            return { result: true, diff: state.pretask.x }
        }
        if (is_AllS_BorBS_B(restBetHistory)) {
            return { result: true, finish: true }
        }
    }

    return { result: false }
}

function findIdxFor_is_G_AllG_GSorS(fullBetHistory) {
    for (let i = 2; i < fullBetHistory.length; i++) {
        let betHistory = _.slice(fullBetHistory, 0, i);
        if (is_G_AllG_GSorS(betHistory)) {
            return i;
        }
    }
    return -1;
}

function isCase3First(betHistory, state) {
    if (betHistory.length === 1 && isLastG(betHistory)) {
        return { result: true, diff: -state.pretask.x }
    }

    if (betHistory.length === 2 && is_G_AllG(betHistory)) {
        return { result: true, val: state.pretask.ballAQty + state.pretask.x }
    }

    if (is_G_AllG(betHistory)) {
        return { result: true, diff: state.pretask.x }
    }

    if (is_G_AllG_hasB(betHistory)) {
        return { result: true, diff: state.pretask.x }
    }

    if (is_G_AllG_hasB_B(betHistory)) {
        return { result: true, finish: true }
    }

    if (is_G_AllG_GSorS(betHistory)) {
        return { result: true, diff: state.pretask.x }
    }

    const idx = findIdxFor_is_G_AllG_GSorS(betHistory);
    if (idx !== -1) {
        const restBetHistory = _.slice(betHistory, idx);
        if (isAllSkip(restBetHistory)) {
            return { result: true, diff: state.pretask.x }
        }

        if (is_OptionalAllS_hasB(restBetHistory)) {
            return { result: true, diff: state.pretask.x }
        }

        if (is_OptionalAllS_hasB_B(restBetHistory)) {
            return { result: true, finish: true }
        }

    }
    return { result: false }
}

function setNextBallAQty(state, val, isMissed) {
    let nextVal = Math.max(0,
        Math.min(state.pretask.totalQty,
            state.ballAQty[state.ballAQty.length - 1] + val));
    if (!isMissed && (nextVal < state.pretask.ballALowerLimit || nextVal > state.pretask.ballAUpperLimit)) {
        return triggerReset(state);
    }
    state.ballAQty.push(nextVal);
}

function triggerReset(state, status) {
    state.resetHistory.push({ idx: state.trialIndex, status: !!status });
    state.ballAQty.push(state.pretask.ballAQty);
}

const initialState = {
    trialIndex: 0,
    timerProgress: 0,
    progressStartTime: 0,
    showMoneyOutcome: false,
    showAfterClickDelay: false,

    // internal data
    bets: [],
    betA: false,
    betB: false,
    betSkip: false,

    pretask: {},
    ballAQty: [],
    resetHistory: [],
    resetStatusHistory: [],
    betResultHistory: [],
    betHistory: [],
    betChosenHistory: [],
    moneyOutcomeHistory: [],
    missHistory: [],
    reactionHistory: [],
};

const pretaskSlice = createSlice({
    name: 'pretask',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        recordBet: (state, action) => {
            const { bets, missed } = action.payload
            state.betHistory.push(bets);
            state.reactionHistory.push(missed ? null : Date.now() - state.progressStartTime);
            state.missHistory.push(missed);
            const randomNum = Math.round(Math.random() * 100)
            const betResult = randomNum < state.ballAQty[state.trialIndex] ?
                'a' : 'b';
            state.betResultHistory.push(betResult);
            if (missed) {
                state.moneyOutcomeHistory.push(state.pretask.missLose)
                state.betChosenHistory.push('')
            } else {
                // calculate moneyOutcome
                let bet = bets[0];
                if (state.bets.length > 1 && Math.random() > 0.5) {
                    bet = bets[1];
                }
                let moneyOutcome = 0;

                if (bet === 'skip') {
                    moneyOutcome = 0;
                }
                if (betResult === 'a' && bet === 'a') {
                    moneyOutcome = state.pretask.ballAWin;
                }
                if (betResult === 'b' && bet === 'a') {
                    moneyOutcome = state.pretask.ballALose;
                }
                if (betResult === 'a' && bet === 'b') {
                    moneyOutcome = state.pretask.ballBLose;
                }
                if (betResult === 'b' && bet === 'b') {
                    moneyOutcome = state.pretask.ballBWin;
                }
                state.betChosenHistory.push(bet)
                state.moneyOutcomeHistory.push(moneyOutcome);
            }
            // show a delay before next game start
            state.showAfterClickDelay = true;
        },
        setShowMoneyOutcome: (state, action) => {
            state.showMoneyOutcome = action.payload;
            // means delay has finished
            state.showAfterClickDelay = false;
        },
        setTimerProgress: (state, action) => {
            state.timerProgress = Math.min(100, action.payload);
        },
        setProgressStartTime: (state, action) => {
            state.progressStartTime = action.payload;
        },
        nextTrial: (state) => {
            state.showMoneyOutcome = false;
            state.timerProgress = 0;
            state.trialIndex++;
            state.bets = [];
            state.betA = false;
            state.betB = false;
            state.betSkip = false;

            // calculate next value based on the tree
            const lastResetIndex = current(state.resetHistory).length > 0 ?
                _.last(current(state.resetHistory)).idx : 0;
            let partialBetHistory = current(state.betHistory).slice(lastResetIndex);
            partialBetHistory = filterOutMissed(partialBetHistory);

            if (current(state.missHistory)[state.trialIndex - 1]) {
                // if last bet missed, then do nothing
                // console.log('case missed')
                setNextBallAQty(state, 0, true)
            } else {
                const checkingFns = [
                    isCase1FirstHalf,
                    isCase1SecondHalf,
                    isCase2First,
                    isCase2Second,
                    isCase3First,
                ]

                for (let checkingFn of checkingFns) {
                    let { result, diff, val, finish } = checkingFn(partialBetHistory, state);
                    if (result) {
                        if (finish) {
                            triggerReset(state, true);
                        } else if (diff) {
                            setNextBallAQty(state, diff)
                        } else if (val) {
                            state.ballAQty.push(val);
                        }
                        return;
                    }
                }

                triggerReset(state);
            }

        },
        resetTraining: (state, action) => {
            let { pretask } = action.payload;
            state.pretask = pretask;
            state.trialIndex = 0;
            state.ballAQty = [];
            state.resetHistory = [];
            state.betResultHistory = [];
            state.betHistory = [];
            state.betChosenHistory = [];
            state.moneyOutcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.bets = [];
            state.betA = false;
            state.betB = false;
            state.betSkip = false;

            state.ballAQty = [pretask.ballAQty];
        },
        removeData: (state, action) => {
            state.trialIndex = 0;
            state.ballAQty = [];
            state.resetHistory = [];
            state.betResultHistory = [];
            state.betHistory = [];
            state.betChosenHistory = [];
            state.moneyOutcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.ballAQty = [];
            state.bets = [];
            state.betA = false;
            state.betB = false;
            state.betSkip = false;
            state.timerProgress = 0;
        },
        reset: (state, action) => {
            let { pretask, pretaskRecord } = action.payload;
            state.pretask = pretask;
            state.ballAQty = [];

            pretaskRecord = pretaskRecord || {};

            state.trialIndex = pretaskRecord.trialIndex || 0;
            state.ballAQty = pretaskRecord.ballAQty || [];
            state.resetHistory = pretaskRecord.resetHistory || [];
            state.betResultHistory = pretaskRecord.betResultHistory || [];
            state.betHistory = (pretaskRecord.betHistory || []).map(el => el.split(','));
            state.betChosenHistory = pretaskRecord.betChosenHistory || [];
            state.moneyOutcomeHistory = pretaskRecord.moneyOutcomeHistory || [];
            state.missHistory = pretaskRecord.missHistory || [];
            state.reactionHistory = pretaskRecord.reactionHistory || [];
            state.bets = [];

            if (state.ballAQty.length === 0) {
                state.ballAQty = [pretask.ballAQty];
            }

        },
        updateBet: (state, action) => {
            const { type, value } = action.payload;
            if (value && !state.bets.includes(type)) {
                state.bets.push(type);
                if (current(state.bets).length > 2) {
                    state.bets.shift();
                }
            } else {
                state.bets = state.bets.filter(v => v !== type);
            }

            state.betA = state.bets.includes("a");
            state.betB = state.bets.includes("b");;
            state.betSkip = state.bets.includes("skip");;
        },
    },
});

export const {
    recordMulResp,
    setProgressStartTime,
    setTimerProgress,
    nextTrial,
    setShowMoneyOutcome,
    reset,
    next,
    recordBet,
    updateBet,
    resetTraining,
    removeData,
} = pretaskSlice.actions;

export const trialIndex = (state) => state.pretask.trialIndex;
export const ballAQty = (state) => state.pretask.ballAQty;
export const showAfterClickDelay = (state) => state.pretask.showAfterClickDelay;
export const timerProgress = (state) => state.pretask.timerProgress;
export const showMoneyOutcome = (state) => state.pretask.showMoneyOutcome;
export const betHistory = (state) => state.pretask.betHistory;
export const moneyOutcomeHistory = (state) => state.pretask.moneyOutcomeHistory;
export const missHistory = (state) => state.pretask.missHistory;
export const reactionHistory = (state) => state.pretask.reactionHistory;
export const pretask = (state) => state.pretask.pretask;
export const betA = (state) => state.pretask.betA;
export const betB = (state) => state.pretask.betB;
export const betSkip = (state) => state.pretask.betSkip;
export const bets = (state) => state.pretask.bets;
export const resetHistory = (state) => state.pretask.resetHistory;
export const betResultHistory = (state) => state.pretask.betResultHistory;
export const betChosenHistory = (state) => state.pretask.betChosenHistory;

export default pretaskSlice.reducer;
