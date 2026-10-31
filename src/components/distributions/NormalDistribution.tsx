import { useEffect } from "react";
import {
    generateRandNumbers,
    getHistogramData,
    numberFormat,
    normalDistribution,
    getStandardNormalDist,
} from "../../app/shared/utils";
import { useDistribution } from "../../app/hooks/useDistribution";
import HistogramChart from "../charts/HistogramChart";
import { BlockMath, InlineMath } from "react-katex";

export function NormalDistribution({ initFuncSteps = 0.1 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from: 0,
            to: 1000
        };

        const randNumbers = generateRandNumbers(
            range.from,
            range.to,
            1_000_000
        );

        const samples = getStandardNormalDist(
            randNumbers,
            ctx.sampleSize,
            ctx.sampleCount
        );

        const densityFunction = (x: number) =>
            normalDistribution(x, 0, 1);

        const groups = getHistogramData(
            samples,
            ctx.range,
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
                <h1>Standard normál eloszlás</h1>

                <p>
                    A standard normális eloszlás a normál eloszlás speciális esete,
                    amelynek várható értéke nulla, szórása pedig egy.
                    A standardizálás olyan statisztikai eljárás, ahol a valószínűségi
                    változó értékeit úgy alakítjuk, hogy azok <b>nulla várható értékkel</b>,
                    és <b>egységnyi szórással</b> rendelkezzenek.
                </p>

                <h2>Alapfogalmak</h2>

                <h3>Standardizálás</h3>
                <p>
                    A standardizálás során a valószínűségi változó értékeiből kivonjuk a várható értéket 
                    (illetve annak becsléseként a számtani átlagot). A számtani átlag egy középérték, 
                    amit számtani középnek is nevezünk. Ha ezt levonjuk minden egyes adatpontból, akkor 
                    az értékek átlaga nulla lesz, vagyis az értékek a nulla körül fognak szóródni.
                    <br />
                    Már csak az egységnyi szórás kialakítása maradt hátra. Ehhez az adott változó szórását használjuk. 
                    Ha elosztjuk vele a középértéktől vett eltéréseket, akkor az így kapott standardizált változó 
                    szórása egységnyi lesz.
                    <br />

                    <b className="me-1">
                        Fontos megjegyezni, hogy ha nem egyedi megfigyelésekről, hanem k-elemű minták átlagairól van szó, 
                        akkor nem a változó szórását, hanem a standard hibát alkalmazzuk. 
                    </b>

                    A standard hiba ugyanis a minták átlagainak szórását fejezi ki.
                </p>

                <h3>Várható érték</h3>

                <p>
                    A <b>várható érték</b> (expected value) kifejezés fontos mind a statisztikában,
                    mint a valószínűségszámításban.
                    A várható érték egy valószínűségi változó lehetséges értékeinek a hozzájuk tartozó
                    valószínűségekkel súlyozott átlaga, amely megadja a változó teoretikus középértékét
                    hosszú távú, ismételt kísérletezés során.
                    <br />
                    <b>
                        Ha minden lehetséges érték azonos valószínűségű, akkor a 
                        várható érték megegyezik a számtani átlaggal.
                    </b>
                </p>

                <h4>Képlet:</h4>
                <div>
                    <BlockMath math="E(X) = \sum_{i=1}^{n} x_i \cdot P(X = x_i)" />
                </div>

                <h4>Példa:</h4>

                <div>
                    <div className="table-responsive my-3">
                        <table className="table table-dark table-bordered align-middle text-center mb-0">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-secondary">
                                        <span className="me-1">Nyeremény</span>
                                        <InlineMath math="x_i" />
                                    </th>
                                    <th scope="col">0 Ft</th>
                                    <th scope="col">10 Ft</th>
                                    <th scope="col">50 Ft</th>
                                    <th scope="col">100 Ft</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className="text-secondary">
                                        <span className="me-1">Valószínűség</span>

                                        <InlineMath math="P(X = x_i)" />
                                    </th>
                                    <td>0,50</td>
                                    <td>0,30</td>
                                    <td>0,15</td>
                                    <td>0,05</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <BlockMath math="E(X) = 0 \cdot 0{,}50 + 10 \cdot 0{,}30 + 50 \cdot 0{,}15 + 100 \cdot 0{,}05 = 0 + 3 + 7{,}5 + 5 = 15{,}5" />
                </div>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 1
                    </p>
                    <p className="mb-0">
                        Ne feledd, itt például a 0,5 50% esélyt jelent!
                    </p>
                </div>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 2
                    </p>
                    <p className="mb-0">
                        Figyeld meg, hogy a valószínűségek együttesen egyet adnak ki!
                    </p>
                </div>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3 p-2">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp 3
                    </p>
                    <p className="mb-0">
                        A standard normális eloszlásnál a módusz, a medián és a várható érték megegyeznek.
                    </p>
                </div>
            </div>

            <div className="border border-dark bg-dark p-2 row m-0 text-light text-center">
                <div className="col-xl-3 col-md-6">
                    <div className="form-group px-1 py-3">
                        <label className="d-block mb-2">
                            Mintavételek száma
                        </label>

                        <input
                            type="range"
                            step={1000}
                            value={ctx.sampleCount}
                            max={100_000}
                            min={1000}
                            onChange={(e) =>
                                ctx.setSampleCount(
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {numberFormat(ctx.sampleCount / 1000)}e
                        </label>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="form-group px-1 py-3">
                        <label className="d-block mb-2">
                            Minta elemszáma
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={2}
                            max={20}
                            value={ctx.sampleSize}
                            onChange={(e) =>
                                ctx.setSampleSize(
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.sampleSize}
                        </label>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="form-group px-1 py-3">
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

                        <label className="mx-2">
                            {ctx.funcSteps.toFixed(2)}
                        </label>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 d-flex align-items-center justify-content-center">
                    <button
                        className="btn btn-generate btn-md"
                        onClick={() => generate()}
                    >
                        Generálás
                    </button>
                </div>
            </div>

            <div
                style={{ marginTop: "-1px" }}
                className="w-100 bg-light border"
            >
                <HistogramChart data={ctx.histogramData} />
            </div>
        </>
    );
}