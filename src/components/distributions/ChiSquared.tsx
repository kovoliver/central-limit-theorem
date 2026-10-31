import { chiSquarePDF, getChiSquared, getHistogramData } from "../../app/shared/utils";
import { useDistribution } from "../../app/hooks/useDistribution";
import HistogramChart from "../charts/HistogramChart";
import { useEffect } from "react";
import DistributionForm from "../forms/DistributionForm";

export function ChiSquared({initFuncSteps = 1}:{initFuncSteps:number}) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from:0,
            to:1000
        };

        const samples = getChiSquared(
            ctx.df1, range,
            ctx.sampleSize, ctx.sampleCount
        );

        const densityFunction = (x: number) => {
            return chiSquarePDF(x, ctx.df1);
        };

        const groups = getHistogramData(samples, ctx.range, densityFunction, funcSteps);
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