import { useEffect } from "react";
import { useDistribution } from "../../app/hooks/useDistribution";
import {
    fDistributionPDF,
    getFDistribution, getHistogramData,
    numberFormat
} from "../../app/shared/utils";
import HistogramChart from "../charts/HistogramChart";
import { BlockMath } from "react-katex";

export function FDistribution({ initFuncSteps = 0.5 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from: 0,
            to: 1000
        };

        const samples = getFDistribution(
            ctx.df1,
            ctx.df2,
            range,
            ctx.sampleSize,
            ctx.sampleCount
        );

        const displayLimit = 10;

        const visibleSamples = samples.filter(
            x => x >= -displayLimit && x <= displayLimit
        );

        const densityFunction = (x: number) => {
            return fDistributionPDF(x, ctx.df1, ctx.df2);
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
                <h1>F-eloszlás</h1>

                <p>
                    Az <b>F-eloszlás</b>, más néven <b>Fisher-Snedecor-eloszlás</b>,
                    egy folytonos valószínűségi eloszlás, amelyet elsősorban varianciák
                    összehasonlítására és varianciaanalízis (ANOVA) során alkalmazunk.
                    Két egymástól független, khi-négyzet eloszlású valószínűségi változó
                    megfelelően skálázott hányadosaként állítható elő.
                    Az eloszlás alakját két szabadságfok határozza meg.
                </p>

                <BlockMath math="F = \frac{U_1 / k_1}{U_2 / k_2}" />

                <p>
                    A képletben <i>U₁</i> és <i>U₂</i> egymástól független,
                    <i>k₁</i>, illetve <i>k₂</i> szabadságfokú khi-négyzet eloszlású
                    valószínűségi változók. A <i>k₁</i> a számláló, a <i>k₂</i> pedig
                    a nevező szabadságfokát jelöli.
                </p>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 1
                    </p>
                    <p className="mb-0">
                        Az F-eloszlás értékei nem lehetnek negatívak, mivel két
                        nemnegatív khi-négyzet változó hányadosából származnak.
                        Az eloszlás általában jobbra ferde, vagyis a nagyobb értékek
                        irányába hosszabb elnyúló széle van.
                    </p>
                </div>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 2
                    </p>
                    <p className="mb-0">
                        Az F-eloszlás alakja mindkét szabadságfoktól függ.
                        A szabadságfokok növelésével az eloszlás egyre koncentráltabbá
                        válik az 1 körüli értékeknél.
                    </p>
                </div>
            </div>

            <div className="border border-dark bg-dark p-2 row m-0 text-light text-center">
                <div className="col-xl-2 col-md-6">
                    <div className="form-group py-3">
                        <label className="d-block mb-2">
                            Mintavételek száma
                        </label>

                        <input
                            type="range"
                            step={1_000}
                            value={ctx.sampleCount}
                            max={100_000}
                            min={1_000}
                            onChange={e =>
                                ctx.setSampleCount(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="ms-1">
                            {numberFormat(ctx.sampleCount / 1000)}e
                        </label>
                    </div>
                </div>

                <div className="col-xl-2 col-md-6">
                    <div className="form-group py-3">
                        <label className="d-block mb-2">
                            Minta elemszáma
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={2}
                            max={20}
                            value={ctx.sampleSize}
                            onChange={e =>
                                ctx.setSampleSize(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="ms-1">
                            {ctx.sampleSize}
                        </label>
                    </div>
                </div>

                <div className="col-xl-2 col-md-6">
                    <div className="form-group py-3">
                        <label className="d-block mb-2">
                            Szf<sub>1</sub>
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={1}
                            max={30}
                            value={ctx.df1}
                            onChange={e =>
                                ctx.setDf1(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="ms-1">
                            {ctx.df1}
                        </label>
                    </div>
                </div>

                <div className="col-xl-2 col-md-6">
                    <div className="form-group py-3">
                        <label className="d-block mb-2">
                            Szf<sub>2</sub>
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={1}
                            max={30}
                            value={ctx.df2}
                            onChange={e =>
                                ctx.setDf2(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="ms-1">
                            {ctx.df2}
                        </label>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="form-group py-3">
                        <label className="d-block mb-2">
                            Osztályköz mérete
                        </label>

                        <input
                            type="range"
                            step={0.05}
                            min={0.05}
                            max={5}
                            value={ctx.funcSteps}
                            onChange={e =>
                                ctx.setFuncSteps(parseFloat(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="ms-1">
                            {ctx.funcSteps.toFixed(2)}
                        </label>
                    </div>
                </div>

                <div className="col-xl-1 col-md-6 d-flex align-items-center justify-content-center">
                    <button
                        className="btn btn-generate btn-md"
                        onClick={() => generate()}
                    >
                        Generálás
                    </button>
                </div>
            </div>

            <div style={{ marginTop: "-1px" }} className="w-100 bg-light border">
                <HistogramChart
                    data={ctx.histogramData}
                />
            </div>
        </>
    );
}