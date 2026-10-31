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

export function getMin(numbers: Float64Array): number {
    let min = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < min) {
            min = numbers[i];
        }
    }

    return min;
}

export function getMax(numbers: Float64Array): number {
    let max = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }

    return max;
}

export function generateRandNumbers(
    from: number,
    to: number,
    count: number
): Float64Array {
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

    const numbers = new Float64Array(count);

    for (let i = 0; i < count; i++) {
        numbers[i] = randContinuous(from, to);
    }

    return numbers;
}

export function getNormalDist(
    numbers: Float64Array,
    sampleSize: number,
    sampleCount: number = 1000
): Float64Array {
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

    const samples = new Float64Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
        let avg = 0;

        for (let j = 0; j < sampleSize; j++) {
            const randNumber = numbers[rand(0, numbers.length - 1)];
            avg += randNumber;
        }

        samples[i] = avg / sampleSize;
    }

    return samples;
}

export function getStandardNormalDist(
    numbers: Float64Array,
    sampleSize: number,
    sampleCount: number = 1000
): Float64Array {
    const samples = getNormalDist(
        numbers,
        sampleSize,
        sampleCount
    );

    const mean = calcMean(samples);
    const std = calcStd(numbers);
    const standardError = std / Math.sqrt(sampleSize);

    const result = new Float64Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
        result[i] = (samples[i] - mean) / standardError;
    }

    return result;
}

export function getChiSquared(
    df: number,
    range: NumberRange,
    sampleSize: number,
    sampleCount: number = 10_000,
): Float64Array {
    const chiSquared = new Float64Array(sampleCount);

    for (let i = 0; i < df; i++) {
        const randNumbers = generateRandNumbers(
            range.from,
            range.to,
            100_000
        );

        const Z = getStandardNormalDist(
            randNumbers,
            sampleSize,
            sampleCount
        );

        for (let j = 0; j < sampleCount; j++) {
            chiSquared[j] += Z[j] ** 2;
        }
    }

    return chiSquared;
}

export function getTDistribution(
    df: number,
    range: NumberRange,
    sampleSize: number,
    sampleCount: number = 10_000,
): Float64Array {
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

    const tDist = new Float64Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) {
        tDist[i] = normalDist[i] / Math.sqrt(chiDist[i] / df);
    }

    return tDist;
}

export function getFDistribution(
    df1: number,
    df2: number,
    range: NumberRange,
    sampleSize: number,
    sampleCount: number = 10_000,
): Float64Array {
    const chi1 = getChiSquared(df1, range, sampleSize, sampleCount);
    const chi2 = getChiSquared(df2, range, sampleSize, sampleCount);

    const fDist = new Float64Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) {
        fDist[i] = (chi1[i] / df1) / (chi2[i] / df2);
    }

    return fDist;
}

export function roundRange(value: number, range: number) {
    return Math.round(value / range) * range;
}

export function calcMean(values: Float64Array): number {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += values[i];
    }
    return total / values.length;
}

export function calcStd(values: Float64Array): number {
    const avg = calcMean(values);
    let totalDiffSq = 0;
    for (let i = 0; i < values.length; i++) {
        totalDiffSq += (values[i] - avg) ** 2;
    }
    return Math.sqrt(totalDiffSq / values.length);
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

export function normalDistribution(
    x: number,
    mean: number,
    std: number
): number {
    if (std <= 0) {
        throw new Error("Standard deviation must be greater than zero.");
    }

    const exponent = -Math.pow(x - mean, 2) /
        (2 * Math.pow(std, 2));

    return (
        1 / (std * Math.sqrt(2 * Math.PI))
    ) * Math.exp(exponent);
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
    samples: Float64Array,
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

        let index = -1;
        for (let j = 0; j < avgGroups.length; j++) {
            if (avgGroups[j].midPoint === midpoint) {
                index = j;
                break;
            }
        }

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

    const filteredGroups: HistogramData[] = [];
    for (let i = 0; i < avgGroups.length; i++) {
        if (avgGroups[i].midPoint !== range.to) {
            filteredGroups.push(avgGroups[i]);
        }
    }

    filteredGroups.sort((a, b) => a.midPoint - b.midPoint);

    return filteredGroups;
}