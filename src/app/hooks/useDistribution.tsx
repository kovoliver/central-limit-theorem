import { useContext } from "react";
import { distContext } from "../../pages/Distributions";

export function useDistribution() {
    const context = useContext(distContext);

    if (context === undefined) {
        throw new Error(
            "useDistribution must be used within Distribution.Provider"
        );
    }

    return context;
}