import React from "react";
import styled from "styled-components";

const StyledFilter = styled.button`
    font-size : 13px;
    padding : 8px 16px ;
    cursor:pointer;
    border-width:0px;
    border-radius: 30px;
    background-color : #dcdcdc;
    color : black;
`;

function Filter(props) {
    const {title, onClick} = props;
    return (
        
            <StyledFilter titile={title} onClick={onClick}>{title || "filter"}</StyledFilter>
      
    
    );
}

export default Filter;