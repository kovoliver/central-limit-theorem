import { useEffect } from "react";
import { useDistribution } from "../../app/hooks/useDistribution";
import { getHistogramData, getTDistribution, tDistributionPDF } from "../../app/shared/utils";
import HistogramChart from "../charts/HistogramChart";
import DistributionForm from "../forms/DistributionForm";
import { BlockMath, InlineMath } from "react-katex";

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


                <div className="bg-light border-light p-3 text-left text-secondary-darker">
                    <h2>Elméleti sűrűségfüggvény</h2>

                    <p>
                        A Student-eloszlás, más néven Student-féle t-eloszlás,
                        szintén rendelkezik elméleti folytonos sűrűségfüggvénnyel.
                        A függvény alakját a szabadságfok (<i>k</i>) határozza meg.
                    </p>

                    <BlockMath math="f(x;k) = \frac{\Gamma\left(\frac{k+1}{2}\right)}{\sqrt{k\pi}\,\Gamma\left(\frac{k}{2}\right)}\left(1+\frac{x^2}{k}\right)^{-\frac{k+1}{2}}" />

                    <p>
                        A képletben <i>x</i> a vizsgált érték, <i>k</i> a szabadságfok,
                        a <i><InlineMath math="\Gamma" /></i> pedig a gammafüggvényt jelöli.
                        A függvény minden valós x értékre értelmezett.
                    </p>

                    <p>
                        <b>Fontos:</b> Ezt a képletet nem szükséges kézzel kiszámolnod.
                        A mindennapi statisztikai számítások során általában nincs
                        szükség a sűrűségfüggvény közvetlen meghatározására.
                        Ha mégis szükség van rá, erre különböző statisztikai
                        szoftverek és programozási könyvtárak állnak rendelkezésre,
                        például a Pythonban található <b>SciPy</b> könyvtár <i>scipy.stats.t</i> modulja.
                    </p>
                </div>


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