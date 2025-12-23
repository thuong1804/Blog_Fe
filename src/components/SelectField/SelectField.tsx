"use client";

import { OptionType } from "@/type/typeProps";
import React from "react";
import Select, {
    ActionMeta,
    GroupBase,
    MultiValue,
    SingleValue,
    StylesConfig,
} from "react-select";

type SelectFieldProps = {
    title?: string;
    options?: readonly (OptionType | GroupBase<OptionType>)[];
    isMulti?: boolean;
    placeholder?: string;
    defaultValue?: OptionType | OptionType[];
    isClearable?: boolean;
    required?: boolean;
    onChange?: (
        newValue: MultiValue<OptionType> | SingleValue<OptionType>,
        actionMeta: ActionMeta<OptionType>,
    ) => void;
};

const customStyles: StylesConfig<OptionType, boolean, GroupBase<OptionType>> = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: "8px",
        borderColor: state.isFocused ? "#2684FF" : "#ddd",
        boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : "none",
        "&:hover": { borderColor: "#2684FF" },
        minHeight: "42px",
    }),
    container: (provided) => ({
        ...provided,
        width: "100%",
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#f0f4ff",
        borderRadius: "6px",
        padding: "2px 6px",
    }),
    singleValue: (provided) => ({
        ...provided,
        backgroundColor: "#eaf0ff",
        borderRadius: "6px",
        padding: "4px 8px",
        color: "#333",
        fontWeight: 500,
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        maxWidth: "calc(100% - 8px)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: "#333",
        fontWeight: 500,
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: "#666",
        "&:hover": { backgroundColor: "#ff4d4f", color: "white" },
    }),
    option: (provided, state) => {
        const isSelected = state.isSelected;
        const isFocused = state.isFocused;

        return {
            ...provided,
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            borderRadius: "6px",
            margin: "2px 8px",
            backgroundColor: isSelected
                ? "#35394a"
                : isFocused
                  ? "#f0f4ff"
                  : "white",
            color: isSelected ? "white" : "#333",
            fontWeight: isSelected ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: isFocused ? "0 0 0 1px #bbbec8 inset" : "none",
            "&:hover": {
                backgroundColor: isSelected ? "#91939d" : "#e6ebff",
            },
            "&:active": {
                backgroundColor: isSelected ? "#91939d" : "#dbe4ff",
            },
        };
    },
    menu: (provided) => ({
        ...provided,
        borderRadius: "8px",
        marginTop: "4px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        backgroundColor: "#ddd",
    }),
};

const SelectField = ({
    title = "Select",
    options = [],
    isMulti = false,
    placeholder = "Select...",
    defaultValue,
    isClearable = true,
    onChange,
    required = false,
}: SelectFieldProps) => {
    const handleChange = (
        newValue: MultiValue<OptionType> | SingleValue<OptionType>,
        _: ActionMeta<OptionType>,
    ) => {
        if (isMulti) {
            onChange?.((newValue as MultiValue<OptionType>) || [], _);
        } else {
            onChange?.((newValue as SingleValue<OptionType>) || null, _);
        }
    };

    return (
        <div className="flex flex-col gap-2 items-start w-full py-2">
            {title && (
                <span className="text-[#000] font-semibold text-sm ">
                    {title}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </span>
            )}
            <Select
                onChange={handleChange}
                options={options}
                styles={customStyles}
                placeholder={placeholder}
                defaultValue={defaultValue}
                isClearable={isClearable}
                isMulti={isMulti}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                required={required}
                instanceId="select-field"
            />
        </div>
    );
};

export default SelectField;
