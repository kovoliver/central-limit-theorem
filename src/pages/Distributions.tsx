import { createContext, useEffect, useState } from "react";
import type {
    DistributionContext,
    DistributionType,
    HistogramData,
    NumberRange,
} from "../app/types";
import { ChiSquared } from "../components/ChiSquared";
import { CentralLimitTheorem } from "../components/CentralLimitTheorem";
import { useParams } from "react-router-dom";
import { Student } from "../components/Student";
import { FDistribution } from "../components/FDistribution";

export const distContext =
    createContext<DistributionContext | undefined>(undefined);

export function Distribution() {
    const { type } = useParams();

    const [distribution, setDistribution] =
        useState<DistributionType>("normal");

    const [histogramData, setHistogramData] =
        useState<HistogramData[]>([]);

    const [sampleCount, setSampleCount] = useState<number>(10_000);
    const [sampleSize, setSampleSize] = useState<number>(3);

    const [df1, setDf1] = useState<number>(1);
    const [df2, setDf2] = useState<number>(1);

    const [range, setRange] = useState<NumberRange>({
        from: 0,
        to: 100,
    });

    const [funcSteps, setFuncSteps] = useState<number>(0.1);

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
        funcSteps,
        setFuncSteps
    };

    const init = ()=> {
        setSampleCount(10_000);
        setSampleSize(3);
        setDf1(1);
        setDf2(1);
        setRange({from:0, to:100});
    };

    useEffect(()=> {
        init();
    }, [type]);

    const getDistributionComponent = () => {
        switch (type) {
            case "central-limit-theorem":
                return <CentralLimitTheorem initFuncSteps={5}/>;
            case "chi-squared":
                return <ChiSquared initFuncSteps={0.5}/>;
            case "student":
                return <Student initFuncSteps={0.5}/>;
            case "f-distribution":
                return <FDistribution initFuncSteps={0.1}/>;
        }
    };

    return (
        <distContext.Provider value={contextValue}>
            <div className="container text-center">
                {getDistributionComponent()}
            </div>
        </distContext.Provider>
    );
}