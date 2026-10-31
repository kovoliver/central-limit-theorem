import React, { useState, useEffect } from "react";
import type { NumberInputProps } from "../../app/shared/types";

export const SecureNumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    defaultValue,
    min,
    max,
    className = "form-control form-control-sm",
}) => {
    const [inputValue, setInputValue] = useState<string>(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valStr = e.target.value;
        setInputValue(valStr);

        const parsed = parseInt(valStr, 10);

        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const handleBlur = () => {
        const parsed = parseInt(inputValue, 10);

        if (isNaN(parsed) || parsed < min || parsed > max) {
            onChange(defaultValue);
            setInputValue(defaultValue.toString());
        } else {
            onChange(parsed);
            setInputValue(parsed.toString());
        }
    };

    return (
        <input
            type="number"
            value={inputValue}
            min={min}
            max={max}
            onChange={handleChange}
            onBlur={handleBlur}
            className={className}
        />
    );
};