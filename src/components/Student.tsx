import { useEffect } from "react";
import { useDistribution } from "../app/hooks/useDistribution";
import { getHistogramData, getTDistribution, tDistributionPDF } from "../app/utils";
import HistogramChart from "./HistogramChart";
import DistributionForm from "./forms/DistributionForm";

export function Student({ initFuncSteps = 0.5 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from:0,
            to:1000
        };

        const samples = getTDistribution(
            ctx.df1,
            range,
            ctx.sampleSize,
            ctx.sampleCount
        );

        const displayLimit = 10;

        const visibleSamples = samples.filter(
            x => x >= -displayLimit && x <= displayLimit
        );

        const densityFunction = (x: number) => {
            return tDistributionPDF(x, ctx.df1);
        };

        const groups = getHistogramData(
            visibleSamples,
            { from: -displayLimit, to: displayLimit },
            densityFunction,
            funcSteps
        );

        ctx.setHistogramData(groups);
    };

    useEffect(() => {
        ctx.setFuncSteps(initFuncSteps);
        generate(initFuncSteps);
    }, []);

    return (
        <>
            <DistributionForm
                generate={()=>generate()}
            />

            <div style={{ marginTop: "-1px" }} className="w-100 bg-light border">
                <HistogramChart
                    data={ctx.histogramData}
                />
            </div>
        </>
    );
}