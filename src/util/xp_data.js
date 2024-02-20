function generateBalloonDataFromDataSeries(dataSeries) {
    const { asset, volume } = dataSeries;
    const length = asset.length;

    return {
        xpData: Object.assign({}, {
            asset,
            volume,
        }),
        xpRecord: {
            // data recordings
            trialIndex: -1,
            reactionHistory: Array.from({ length }).fill(null),
            clickToShowChartHistory: Array.from({ length }).fill(null),
            choiceHistory: Array.from({ length }).fill(null),
            outcomeHistory: Array.from({ length }).fill(null),
            missHistory: Array.from({ length }).fill(false),
        },
        pickedOutcomeIndexes: [],
    };
}

function generateBalloonData(xp) {
    // hard code for training session
    const asset = [1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, 1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, 1, 1];
    const volume = [0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 1, 2, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 1, 2, 3, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 3, 4, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1];
    const length = asset.length;

    return {
        xpData: Object.assign({}, {
            asset,
            volume,
        }),
        xpRecord: {
            // data recordings
            trialIndex: -1,
            reactionHistory: Array.from({ length }).fill(null),
            clickToShowChartHistory: Array.from({ length }).fill(null),
            choiceHistory: Array.from({ length }).fill(null),
            outcomeHistory: Array.from({ length }).fill(null),
            missHistory: Array.from({ length }).fill(false),
        },
        pickedOutcomeIndexes: [],
    };
}

function extractXpData(attendant, xpConfig) {
    const historyLength = 10;
    const {
        xpData,
        xpRecord,
        pickedOutcomeIndexes,
    } = attendant;
    const rows = []
    const {
        asset,
        volume,
    } = xpData;
    const {
        reactionHistory,
        choiceHistory,
        outcomeHistory,
        clickToShowChartHistory,
    } = xpRecord;

    let sum = 0;
    const accumulateOutcomeHistory = outcomeHistory.map((v, i) => {
        if (pickedOutcomeIndexes.includes(i)) {
            sum = sum + v
            return sum;
        }
        return null;
    });

    let fullSum = 0;
    const fullAccumulateOutcomeHistory = outcomeHistory.map((v) => {
        fullSum = fullSum + v
        return fullSum;
    });

    const mcqs = calcuateCorrectness(attendant, xpConfig);

    for (let i = 0; i < asset.length - historyLength; i++) {
        rows.push(Object.assign(
            {
                id: i + 1,
                value: asset[i + historyLength],
                speed: volume[i + historyLength],
                // aberration: aberration[i],
                // shift: shift[i],
                reaction: reactionHistory[i],
                choice: choiceHistory[i],
                outcome: outcomeHistory[i],
                pickedOutcome: pickedOutcomeIndexes.includes(i) ? outcomeHistory[i] : null,
                accumulateOutcome: accumulateOutcomeHistory[i],
                fullAccumulateOutcomeHistory: fullAccumulateOutcomeHistory[i],
                clickToShowChart: clickToShowChartHistory[i] === null ? '' : clickToShowChartHistory[i] ? 1 : 0,
            },
            {
                username: attendant.username,
                gender: attendant.gender,
                age: attendant.age,
                major: attendant.major,
                education: attendant.education,
            }, mcqs,
            {
                strategy: attendant.strategy,
                strategy2: attendant.strategy2,
                earningQuiz1: attendant?.earningQuiz?.question1,
                earningQuiz2: attendant?.earningQuiz?.question2,
                earningQuiz3: attendant?.earningQuiz?.question3,
                earningQuiz4: attendant?.earningQuiz?.question4,
                earningQuiz5: attendant?.earningQuiz?.question5,
            }
        ))
    }
    return rows;
}

const calcuateCorrectness = (attendant, xpConfig) => {
    if (!attendant.quizAnswers) {
        return {};
    }

    let solution;

    switch (xpConfig.treatment) {
        case 3:
            solution = {
                mcq1: 2,
                mcq2: 1,
                mcq3: 1,
                mcq4: 2,
                mcq5: 2,
                mcq6: 3,
                mcq7: 4,
                mcq8: 1,
                mcq9: 1,
                mcq10: 2,
                mcq11: 1,
                mcq12: 1,
            }
            return {
                mcq1: attendant.quizAnswers.mcq1 === solution.mcq1 ? 1 : 0,
                mcq2: attendant.quizAnswers.mcq2 === solution.mcq2 ? 1 : 0,
                mcq3: attendant.quizAnswers.mcq3 === solution.mcq3 ? 1 : 0,
                mcq4: attendant.quizAnswers.mcq4 === solution.mcq4 ? 1 : 0,
                mcq5: attendant.quizAnswers.mcq5 === solution.mcq5 ? 1 : 0,
                mcq6: attendant.quizAnswers.mcq6 === solution.mcq6 ? 1 : 0,
                mcq7: attendant.quizAnswers.mcq7 === solution.mcq7 ? 1 : 0,
                mcq8: attendant.quizAnswers.mcq8 === solution.mcq8 ? 1 : 0,
                mcq9: attendant.quizAnswers.mcq9 === solution.mcq9 ? 1 : 0,
                mcq10: attendant.quizAnswers.mcq10 === solution.mcq10 ? 1 : 0,
                mcq11: attendant.quizAnswers.mcq11 === solution.mcq11 ? 1 : 0,
                mcq12: attendant.quizAnswers.mcq12 === solution.mcq12 ? 1 : 0,
            };
        case 2:
            solution = {
                mcq1: 2,
                mcq2: 2,
                mcq3: 3,
                mcq4: 4,
                mcq5: 1,
                mcq6: 1,
                mcq7: 1,
                mcq8: 2,
                mcq9: 1,
                mcq10: 1,
            }
            return {
                mcq1: attendant.quizAnswers.mcq1 === solution.mcq1 ? 1 : 0,
                mcq2: attendant.quizAnswers.mcq2 === solution.mcq2 ? 1 : 0,
                mcq3: attendant.quizAnswers.mcq3 === solution.mcq3 ? 1 : 0,
                mcq4: attendant.quizAnswers.mcq4 === solution.mcq4 ? 1 : 0,
                mcq5: attendant.quizAnswers.mcq5 === solution.mcq5 ? 1 : 0,
                mcq6: attendant.quizAnswers.mcq6 === solution.mcq6 ? 1 : 0,
                mcq7: attendant.quizAnswers.mcq7 === solution.mcq7 ? 1 : 0,
                mcq8: attendant.quizAnswers.mcq8 === solution.mcq8 ? 1 : 0,
                mcq9: attendant.quizAnswers.mcq9 === solution.mcq9 ? 1 : 0,
                mcq10: attendant.quizAnswers.mcq10 === solution.mcq10 ? 1 : 0,
            };
        case 1:
        default:
            solution = {
                mcq1: 2,
                mcq2: 2,
                mcq3: 3,
                mcq4: 4,
                mcq5: 1,
                mcq6: 1,
                mcq7: 2,
                mcq8: 1,
                mcq9: 1,
            }

            return {
                mcq1: attendant.quizAnswers.mcq1 === solution.mcq1 ? 1 : 0,
                mcq2: attendant.quizAnswers.mcq2 === solution.mcq2 ? 1 : 0,
                mcq3: attendant.quizAnswers.mcq3 === solution.mcq3 ? 1 : 0,
                mcq4: attendant.quizAnswers.mcq4 === solution.mcq4 ? 1 : 0,
                mcq5: attendant.quizAnswers.mcq5 === solution.mcq5 ? 1 : 0,
                mcq6: attendant.quizAnswers.mcq6 === solution.mcq6 ? 1 : 0,
                mcq7: attendant.quizAnswers.mcq7 === solution.mcq7 ? 1 : 0,
                mcq8: attendant.quizAnswers.mcq8 === solution.mcq8 ? 1 : 0,
                mcq9: attendant.quizAnswers.mcq9 === solution.mcq9 ? 1 : 0,
            }
    }

}

export {
    generateBalloonDataFromDataSeries,
    generateBalloonData,
    extractXpData,
    calcuateCorrectness,
};