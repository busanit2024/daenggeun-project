import React from "react";
import styled from "styled-components";

const StyledFilter = styled.span`
    font-size : 16px;
    padding : 8px 16px ;
    border-width:0px;
    border-radius: 10px;
    background-color : rgba(245, 245, 245);
    color : black;
`;

function SquareFilter(props) {
    const {title, variant, onClick} = props;
    return (
        <StyledFilter title={title} onClick={onClick} variant={variant}>{title || "filter"}</StyledFilter>
    );
}

export default SquareFilter;