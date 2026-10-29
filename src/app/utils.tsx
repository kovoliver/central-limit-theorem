import type { DensityFunction, HistogramData, NumberRange } from "./types";

export const rand = (
    from: number,
    to: number
): number => {
    if (from > to) {
        throw new Error(
            '"from" parameter cannot be greater than "to".'
        );
    }

    return Math.floor(Math.random() * ((to - from) + 1)) + from;
};

export const randContinuous = (
    from: number,
    to: number
): number => {
    if (from > to) {
        throw new Error('"from" parameter cannot be greater than "to".');
    }

    return Math.random() * (to - from) + from;
};

export function generateRandNumbers(
    from: number,
    to: number,
    count: number
): number[] {
    if (count <= 0) {
        throw new Error(
            "'Count' parameter must be greater, than zero!"
        );
    }

    if (!Number.isInteger(count)) {
        throw new Error(
            "'Count' parameter must be a positive integer!"
        );
    }

    const numbers = [];

    for (let i = 0; i < count; i++) {
        numbers.push(randContinuous(from, to));
    }

    return numbers;
}

export function getNormalDist(
    numbers: number[],
    sampleSize: number,
    sampleCount: number = 1000
) {
    if (numbers.length === 0) {
        throw new Error(
            "'Numbers' parameter cannot be empty!"
        );
    }

    if (numbers.length < sampleSize) {
        throw new Error(
            "'Sample size' parameter cannot be greater than the population size!"
        );
    }

    const samples = [];

    for (let i = 0; i < sampleCount; i++) {
        let avg = 0;

        for (let j = 0; j < sampleSize; j++) {
            const randNumber = numbers[rand(0, numbers.length - 1)];
            avg += randNumber;

        }

        samples.push(avg / sampleSize);
    }

    return samples;
}

export function getStandardNormalDist(
    numbers: number[],
    sampleSize: number,
    sampleCount: number = 1000
) {
    const samples = getNormalDist(
        numbers,
        sampleSize,
        sampleCount
    );

    const mean = (Math.min(...numbers) + Math.max(...numbers)) / 2;
    const std = calcStd(numbers);
    const standardError = std / Math.sqrt(sampleSize);

    return samples.map(
        sample => (sample - mean) / standardError
    );
}

export function getChiSquared(
    df: number,
    range: NumberRange,
    sampleSize: number,
    sampleCount: number = 10_000,
) {
    let chiSquared: number[] = new Array(sampleCount).fill(0);

    for (let i = 0; i < df; i++) {
        const randNumbers1 = generateRandNumbers(range.from, range.to, 100_000);
        const randNumbers2 = generateRandNumbers(range.from, range.to, 100_000);
        const sigma = (range.to - range.from) / Math.sqrt(6 * sampleSize);

        const sample1 = getNormalDist(randNumbers1, sampleSize, sampleCount);
        const sample2 = getNormalDist(randNumbers2, sampleSize, sampleCount);

        const squaredDiffs = sample1.map(
            (s, i) => ((s - sample2[i]) / sigma) ** 2
        );

        chiSquared = chiSquared.map((val, i) => val + squaredDiffs[i]);
    }


    return chiSquared;
}

export function getTDistribution(
    df: number,
    range: NumberRange,
    sampleSize: number,
    sampleCount: number = 10_000,
) {
    const randNumbersNormal = generateRandNumbers(
        range.from,
        range.to,
        100_000
    );

    const normalDist = getStandardNormalDist(
        randNumbersNormal,
        sampleSize,
        sampleCount
    );

    const chiDist = getChiSquared(
        df,
        range,
        sampleSize,
        sampleCount
    );

    const tDist = chiDist.map(
        (sample, i) => normalDist[i] / Math.sqrt(sample / df)
    );

    return tDist;
}

export function getFDistribution(
    df1: number,
    df2: number,
    range: NumberRange,
    sampleSize: number,
    sampleCount: number = 10_000,
) {
    const chi1 = getChiSquared(df1, range, sampleSize, sampleCount);
    const chi2 = getChiSquared(df2, range, sampleSize, sampleCount);

    const fDist = chi1.map(
        (sample, i) => (sample / df1) / (chi2[i] / df2)
    );
    
    return fDist;
}

export function roundRange(value: number, range: number) {
    return Math.round(value / range) * range;
}

export function normalDistribution(
    x: number,
    mean: number,
    standardDeviation: number
): number {
    if (standardDeviation <= 0) {
        throw new Error("Standard deviation must be greater than zero.");
    }

    const exponent = -Math.pow(x - mean, 2) /
        (2 * Math.pow(standardDeviation, 2));

    return (
        1 / (standardDeviation * Math.sqrt(2 * Math.PI))
    ) * Math.exp(exponent);
}

export function calcMean(values: number[]) {
    const mean = values.reduce((total, val) => total + val, 0) / values.length;
    return mean;
}

export function calcStd(values: number[]) {
    const avg = calcMean(values);
    return Math.sqrt(values.reduce((total, val) => total + (val - avg) ** 2, 0) / values.length);
}

export function calcSampleStd(
    std: number,
    sampleCount: number
): number {
    return std / Math.sqrt(sampleCount);
}

export function numberFormat(
    value: number,
    locale: string = "hu-HU",
    maximumFractionDigits: number = 2
): string {
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits
    }).format(value);
}

export function logGamma(z: number): number {
    const coefficients = [
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7,
    ];

    if (z < 0.5) {
        return Math.log(Math.PI)
            - Math.log(Math.sin(Math.PI * z))
            - logGamma(1 - z);
    }

    z -= 1;

    let x = 0.99999999999980993;

    for (let i = 0; i < coefficients.length; i++) {
        x += coefficients[i] / (z + i + 1);
    }

    const t = z + coefficients.length - 0.5;

    return (
        0.5 * Math.log(2 * Math.PI)
        + (z + 0.5) * Math.log(t)
        - t
        + Math.log(x)
    );
}

export function chiSquarePDF(x: number, k: number): number {
    if (x <= 0) return 0;

    if (k <= 0 || !Number.isInteger(k)) {
        throw new Error("The degrees of freedom must be a positive integer.");
    }

    const logDensity =
        (k / 2 - 1) * Math.log(x)
        - x / 2
        - (k / 2) * Math.log(2)
        - logGamma(k / 2);

    return Math.exp(logDensity);
}

export function tDistributionPDF(x: number, df: number): number {
    if (df <= 0 || !Number.isInteger(df)) {
        throw new Error("The degrees of freedom must be a positive integer.");
    }

    const logDensity =
        logGamma((df + 1) / 2)
        - logGamma(df / 2)
        - 0.5 * Math.log(df * Math.PI)
        - ((df + 1) / 2) * Math.log(1 + (x * x) / df);

    return Math.exp(logDensity);
}


export function fDistributionPDF(
    x: number,
    df1: number,
    df2: number
): number {
    if (
        df1 <= 0 || !Number.isInteger(df1) ||
        df2 <= 0 || !Number.isInteger(df2)
    ) {
        throw new Error(
            "The degrees of freedom must be positive integers."
        );
    }

    if (x <= 0) return 0;

    const logDensity =
        (df1 / 2) * Math.log(df1 / df2)
        + (df1 / 2 - 1) * Math.log(x)
        + logGamma((df1 + df2) / 2)
        - logGamma(df1 / 2)
        - logGamma(df2 / 2)
        - ((df1 + df2) / 2) * Math.log(
            1 + (df1 / df2) * x
        );

    return Math.exp(logDensity);
}

export function getHistogramData(
    samples: number[],
    range: NumberRange,
    densityFunction: DensityFunction,
    funcSteps: number = 5,
): HistogramData[] {
    const avgGroups: HistogramData[] = [];

    for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        const avg = roundRange(sample, funcSteps);
        const midpoint = avg + funcSteps / 2;
        const fixed = Number.isInteger(funcSteps) ? 0 : 1;
        const bin = `${avg.toFixed(fixed)}|${(avg + funcSteps).toFixed(fixed)}`;

        const index = avgGroups.findIndex(
            data => data.midPoint === midpoint
        );

        if (index === -1) {
            const density = densityFunction(midpoint) * samples.length * funcSteps;

            avgGroups.push({
                bin: bin,
                midPoint: midpoint,
                frequency: 1,
                curve: density,
            });
        } else {
            const element = avgGroups[index];

            avgGroups[index].frequency = element.frequency + 1;
            avgGroups[index].bin = bin;
        }
    }

    // const firstPointIndex = avgGroups.findIndex(
    //     g => g.midPoint === range.from
    // );

    // const firstPoint: HistogramData = {
    //     bin: `${range.from}-${range.from + interval}`,
    //     midPoint: range.from,
    //     frequency: 0,
    //     curve:
    //         densityFunction(range.from + interval / 2) *
    //         samples.length *
    //         interval,
    // };

    // if (firstPointIndex !== -1) {
    //     avgGroups[firstPointIndex] = firstPoint;
    // } else {
    //     avgGroups.push(firstPoint);
    // }

    const orderedGroups = avgGroups
        .filter(g => g.midPoint !== range.to)
        .sort((a, b) => a.midPoint - b.midPoint);

    // const lastBinStart = range.to - interval;

    // if (
    //     orderedGroups.length === 0 ||
    //     orderedGroups[orderedGroups.length - 1].midPoint !== lastBinStart
    // ) {
    //     orderedGroups.push({
    //         bin: `${lastBinStart}-${range.to}`,
    //         midPoint: lastBinStart,
    //         frequency: 0,
    //         curve:
    //             densityFunction(range.to - interval / 2) *
    //             samples.length *
    //             interval,
    //     });
    // }

    return orderedGroups;
}