import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { type HistogramData } from "../app/types";

export default function HistogramChart({ data }: { data: HistogramData[] }) {
    return (
        <section className="w-100">
            <div style={{height: 520 }}>
                <ResponsiveContainer>
                    <ComposedChart
                        data={data}
                        margin={{ top: 20, right: 25, bottom: 35, left: 20 }}
                        barCategoryGap={1}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            type="number"
                            dataKey="midPoint"
                            label={{
                                value: "Osztályközök",
                                position: "insideBottom",
                                offset: -20,
                            }}
                            padding={{ left: 0, right: 0 }}
                            domain={[
                                data[0]?.midPoint ?? 'auto',
                                data[data.length - 1]?.midPoint ?? 'auto'
                            ]}
                            ticks={data.map(item => item.midPoint)}
                            tickCount={Math.max(data.length, 10)}
                            tickFormatter={(value) => {
                                const item = data.find((d) => d.midPoint === value);
                                return item ? item.bin : "";
                            }}
                            fontSize={12}
                        />

                        <YAxis
                            label={{
                                value: "Gyakoriság",
                                angle: -90,
                                position: "insideLeft",
                            }}
                            domain={[0, "auto"]}
                        />

                        <Tooltip
                            labelFormatter={(_, payload) => {
                                if (payload && payload.length > 0) {
                                    const dataItem = payload[0].payload as HistogramData;
                                    return dataItem.bin ? `Osztályköz: ${dataItem.bin}` : "Origó / Lezárás";
                                }

                                return "";
                            }}
                            formatter={(a: any, b: any) => {
                                return [a.toFixed(0), b];
                            }}
                        />

                        <Legend
                            layout="horizontal"
                            position="top"
                            wrapperStyle={{
                                paddingBottom: "15px"
                            }}
                        />

                        <Bar
                            dataKey="frequency"
                            name="Empirikus gyakoriság"
                            fill="#6495ED"
                        />

                        <Line
                            type="natural"
                            dataKey="curve"
                            name="Elméleti görbe"
                            stroke="#E4572E"
                            strokeWidth={3}
                            dot={false}
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
