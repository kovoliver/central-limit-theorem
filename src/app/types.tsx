import type { Dispatch, SetStateAction } from "react";

export type HistogramData = {
    bin: string;
    midPoint: number;
    frequency: number;
    curve: number;
};

export type NumberRange = {
    from: number;
    to: number;
};

export type DistributionType =
    | "normal"
    | "chi-square"
    | "student-t"
    | "f";

export type DistributionContext = {
    distribution: DistributionType;
    setDistribution: Dispatch<SetStateAction<DistributionType>>;

    histogramData: HistogramData[];
    setHistogramData: Dispatch<SetStateAction<HistogramData[]>>;

    sampleCount: number;
    setSampleCount: Dispatch<SetStateAction<number>>;

    sampleSize: number;
    setSampleSize: Dispatch<SetStateAction<number>>;

    df1: number;
    setDf1: Dispatch<SetStateAction<number>>;

    df2: number;
    setDf2: Dispatch<SetStateAction<number>>;

    range: NumberRange;
    setRange: Dispatch<SetStateAction<NumberRange>>;
};

export type DensityFunction = (x: number) => number;