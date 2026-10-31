import { useEffect } from "react";
import { useDistribution } from "../../app/hooks/useDistribution";
import { getHistogramData, getTDistribution, tDistributionPDF } from "../../app/shared/utils";
import HistogramChart from "../charts/HistogramChart";
import DistributionForm from "../forms/DistributionForm";
import { BlockMath } from "react-katex";

export function Student({ initFuncSteps = 0.5 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from: 0,
            to: 1000
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
            <div className="bg-light border-light p-3 text-left text-secondary-darker">
                <h1>Student-eloszlás</h1>

                <p>
                    A <b>Student-eloszlás</b>, más néven <b>Student-féle t-eloszlás</b>,
                    egy folytonos valószínűségi eloszlás, amelyet elsősorban a normális
                    eloszlású populációk átlagának vizsgálatakor alkalmazunk, különösen
                    akkor, ha a populáció szórása ismeretlen, és azt a mintából becsüljük.
                    Az eloszlás alakját a <i>k</i> szabadságfok határozza meg.
                </p>

                <BlockMath math="T = \frac{Z}{\sqrt{\frac{U}{k}}}" />

                <p>
                    A képletben <i>Z</i> standard normális eloszlású, <i>U</i> pedig
                    <i>k</i> szabadságfokú khi-négyzet eloszlású, egymástól független
                    valószínűségi változó.
                </p>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 1
                    </p>
                    <p className="mb-0">
                        A Student-eloszlás a standard normális eloszláshoz hasonlóan
                        szimmetrikus, várható értéke (ha a szabadságfok nagyobb mint 1)
                        nulla. Ugyanakkor a szélein nagyobb valószínűségeket rendel az
                        extrém értékekhez, vagyis vastagabb szélekkel rendelkezik.
                    </p>
                </div>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 2
                    </p>
                    <p className="mb-0">
                        A szabadságfok növelésével a Student-eloszlás egyre jobban
                        megközelíti a standard normális eloszlást. Nagy szabadságfok
                        esetén a két eloszlás közötti különbség már elhanyagolható.
                    </p>
                </div>
            </div>

            <DistributionForm
                generate={() => generate()}
            />

            <div style={{ marginTop: "-1px" }} className="w-100 bg-light border">
                <HistogramChart
                    data={ctx.histogramData}
                />
            </div>
        </>
    );
}