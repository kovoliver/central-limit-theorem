import { useContext } from "react";
import { distContext } from "../../components/pages/Distributions";

export function useDistribution() {
    const context = useContext(distContext);

    if (context === undefined) {
        throw new Error(
            "useDistribution must be used within Distribution.Provider"
        );
    }

    return context;
}