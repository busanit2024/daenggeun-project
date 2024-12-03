import React from "react";
import styled from "styled-components";

const StyledFilter = styled.span`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size : 16px;
    padding : 8px 16px ;
    border-width:0px;
    border-radius: 10px;
    background-color : rgba(245, 245, 245);
    color : black;

    ${props => {
        switch (props.variant) {
            case 'tag' :
                return `
                    font-size: 14px;
                `;
        }
    }}
`;

function SquareFilter(props) {
    const {children, title, variant, onClick} = props;
    return (
        <StyledFilter title={title} onClick={onClick} variant={variant}>{children}{title || "filter"}</StyledFilter>
    );
}

export default SquareFilter;