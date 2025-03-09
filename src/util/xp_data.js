function generateBalloonDataFromDataSeries(dataSeries) {
    const { asset, volume, name } = dataSeries;
    const length = asset.length;

    const shift = Array.from({ length: length }).fill(0);
    const aberration = Array.from({ length: length }).fill(0);
    for (let i = 1; i <= asset.length; i++) {
        if (asset[i] * asset[i - 1] < 0 && volume[i - 1] > 0) {
            shift[i] = 1
        }
        if (asset[i] * asset[i - 1] < 0 && volume[i - 1] <= 0) {
            aberration[i] = 1
        }
    }

    return {
        xpData: Object.assign({}, {
            asset,
            volume,
            shift,
            aberration,
            dataSeriesName: name
        }),
        xpRecord: {
            // data recordings
            trialIndex: 0,
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
    // hard code for training sessio
    const asset = [1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const volume = [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const length = asset.length;

    const shift = Array.from({ length: length + 1 }).fill(0);
    const aberration = Array.from({ length: length }).fill(0);
    for (let i = 1; i <= asset.length; i++) {
        if (asset[i] * asset[i - 1] < 0 && volume[i - 1] > 0) {
            shift[i] = 1
        }
        if (asset[i] * asset[i - 1] < 0 && volume[i - 1] <= 0) {
            aberration[i] = 1
        }
    }

    return {
        xpData: Object.assign({}, {
            asset,
            volume,
            shift,
            aberration,
        }),
        xpRecord: {
            // data recordings
            trialIndex: 0,
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
        breakPageTimeTakes,
    } = attendant;
    const rows = []
    const {
        asset,
        volume,
        shift,
        aberration,
        dataSeriesName,
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
                value: asset[i + historyLength - 1],
                speed: volume[i + historyLength - 1],
                aberration: aberration ? aberration[i + historyLength] : '-',
                shift: shift ? shift[i + historyLength] : '-',
                reaction: reactionHistory[i],
                choice: choiceHistory[i] / 10,
                outcome: outcomeHistory[i],
                pickedOutcome: pickedOutcomeIndexes.includes(i) ? outcomeHistory[i] : null,
                accumulateOutcome: accumulateOutcomeHistory[i],
                fullAccumulateOutcomeHistory: fullAccumulateOutcomeHistory[i],
                clickToShowChart: clickToShowChartHistory[i] === null ? '' : clickToShowChartHistory[i] ? 1 : 0,
            },
            {
                breakPageTimeTakes,
                dataSeriesName,
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

                zoneQuizHappened: !!attendant?.mathZoneQuiz,
                zoneQuizAnswer: attendant?.mathZoneQuiz?.q1,
                zoneQuizConfidence: attendant?.mathZoneQuiz?.q2,
                zoneQuizTrialIndex: attendant?.mathZoneQuiz?.trialIndexParam,

                aberrQuizHappened: !!attendant?.mathAberrQuiz,
                aberrQuizAnswer: attendant?.mathAberrQuiz?.q1,
                aberrQuizConfidence: attendant?.mathAberrQuiz?.q2,
                aberrQuizTrialIndex: attendant?.mathAberrQuiz?.trialIndexParam,

                finalQuizHappened: !!attendant?.mathFinalQuiz,
                finalQuizAnswer: attendant?.mathFinalQuiz?.q1,
                finalQuizConfidence: attendant?.mathFinalQuiz?.q2,

            },
            {
                'finalEarning_$xx': attendant.finalEarning,
                'adjustedEarning_$yy': attendant.adjustedEarning,
            }
        ))
    }

    // push last one
    rows.push(Object.assign(
        {
            id: asset.length - historyLength + 1,
            value: asset[asset.length - 1],
            speed: volume[asset.length - 1],
        }
    ))
    return rows;
}

const calcuateCorrectness = (attendant, xpConfig) => {
    if (!attendant.quizAnswers) {
        return {};
    }

    const solution = {
        mcq1: 1,
        mcq2: 2,
        mcq3: 1,
        mcq4: 1,
        mcq5: 1,
        mcq6: 1,
        mcq7: 4,
        mcq8: 2,
        mcq9: 1,
        mcq10: 2,
        mcq11: 1,
        mcq12: 1,
        mcq13: 1,
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
        // mcq12: attendant.quizAnswers.mcq12 === solution.mcq12 ? 1 : 0,
        // mcq13: attendant.quizAnswers.mcq13 === solution.mcq13 ? 1 : 0,
    };
}

export {
    generateBalloonDataFromDataSeries,
    generateBalloonData,
    extractXpData,
    calcuateCorrectness,
};