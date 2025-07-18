import React from "react";

const FilterItem = ({ id, isChecked, onChange, label }) => (
    <div className="filter-item">
        <label className="filter-switch" htmlFor={id}>
            <input type="checkbox" id={id} checked={isChecked} onChange={(e) => onChange(e.target.checked)} />
            <span className="slider"></span>
        </label>
        <span>{label}</span>
    </div>
);

const Filter = ({ filters }) => {
    return (
        <div id="filter-container">
            {filters.map((filter) => (
                <FilterItem
                    key={filter.id}
                    id={filter.id}
                    isChecked={filter.isChecked}
                    onChange={filter.onChange}
                    label={filter.label}
                />
            ))}
        </div>
    );
};

export default Filter;
