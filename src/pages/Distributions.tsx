import { createContext, useState } from "react";
import type {
    DistributionContext,
    DistributionType,
    HistogramData,
    NumberRange,
} from "../app/types";
import { ChiSquared } from "../components/ChiSquared";
import { CentralLimitTheorem } from "../components/CentralLimitTheorem";
import { useParams } from "react-router-dom";

export const distContext =
    createContext<DistributionContext | undefined>(undefined);

export function Distribution() {
    const { type } = useParams();

    const [distribution, setDistribution] =
        useState<DistributionType>("normal");

    const [histogramData, setHistogramData] =
        useState<HistogramData[]>([]);

    const [sampleCount, setSampleCount] = useState(10_000);
    const [sampleSize, setSampleSize] = useState(3);

    const [df1, setDf1] = useState(1);
    const [df2, setDf2] = useState(1);

    const [range, setRange] = useState<NumberRange>({
        from: 0,
        to: 100,
    });

    const contextValue: DistributionContext = {
        distribution,
        setDistribution,
        histogramData,
        setHistogramData,
        sampleCount,
        setSampleCount,
        sampleSize,
        setSampleSize,
        df1,
        setDf1,
        df2,
        setDf2,
        range,
        setRange,
    };

    const getDistributionComponent = () => {
        switch (type) {
            case "chi-squared":
                return <ChiSquared />;
            case "central-limit":
            default:
                return <CentralLimitTheorem />;
        }
    };

    return (
        <distContext.Provider value={contextValue}>
            <div className="container">
                {getDistributionComponent()}
            </div>
        </distContext.Provider>
    );
}