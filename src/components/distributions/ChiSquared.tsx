import { chiSquarePDF, getChiSquared, getHistogramData } from "../../app/shared/utils";
import { useDistribution } from "../../app/hooks/useDistribution";
import HistogramChart from "../charts/HistogramChart";
import { useEffect } from "react";
import DistributionForm from "../forms/DistributionForm";
import { BlockMath, InlineMath } from "react-katex";

export function ChiSquared({ initFuncSteps = 1 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from: 0,
            to: 1000
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
            <div className="bg-light border-light p-3 text-left text-secondary-darker">
                <h1>Khi-négyzet eloszlás</h1>

                <p>
                    A <b>khi-négyzet eloszlás</b> <i>k</i> darab független, <b>standard normális eloszlású</b> valószínűségi
                    változó négyzetösszegének eloszlása. A <i>k</i> itt az úgynevezett szabadságfok, amely
                    meghatározza, hány standard normális eloszlású változó négyzetét összegezzük.
                </p>

                <BlockMath math="\chi^2 = \sum_{i=1}^{k} Z_i^2" />

                <div className="bg-light border-light text-left text-secondary-darker">
                    <h2>Elméleti sűrűségfüggvény</h2>

                    <p>
                        A khi-négyzet eloszlás rendelkezik egy elméleti folytonos
                        sűrűségfüggvénnyel, amelynek alakját a szabadságfok (<i>k</i>)
                        határozza meg. A függvény segítségével meghatározható,
                        hogy az egyes értékek milyen valószínűségi sűrűséggel
                        fordulnak elő az eloszlásban.
                    </p>

                    <BlockMath math="f(x;k) = \frac{1}{2^{k/2}\Gamma(k/2)}x^{k/2-1}e^{-x/2}" />

                    <p>
                        A képletben <i>x</i> a vizsgált érték, <i>k</i> a szabadságfok,
                        a <i><InlineMath math="\Gamma" /></i> pedig a gammafüggvényt jelöli.
                        A függvény értelmezési tartománya x &gt; 0.
                    </p>

                    <p>
                        <b>Fontos:</b> Ezt a képletet nem szükséges kézzel kiszámolnod.
                        A mindennapi statisztikai számítások során általában nincs
                        szükség a sűrűségfüggvény közvetlen meghatározására.
                        Ha mégis szükség van rá, erre különböző statisztikai
                        szoftverek és programozási könyvtárak állnak rendelkezésre,
                        például a Pythonban található <b>SciPy</b> könyvtár <i>scipy.stats.chi2</i> modulja.
                    </p>
                </div>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 1
                    </p>
                    <p className="mb-0">
                        A standard normális eloszlás értékei a nulla körül koncentrálódnak,
                        mivel nulla a várható értéke. Tekintve, hogy a négyzetre emelt értékek nem lehetnek
                        nullánál kisebbek, ezért a khi-négyzet eloszlás értékei sem lehetnek negatívak.
                    </p>
                </div>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 2
                    </p>
                    <p className="mb-0">
                        Ha módosítod a szabadságfokot, akkor az eloszlás módusza (maximumának helye)
                        a szabadságfok - 2 értéknél lesz, amennyiben a szabadságfok legalább 2.
                        Például 20 szabadságfok esetében az eloszlás maximuma x = 18-nál található.
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