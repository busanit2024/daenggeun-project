import React from "react";
import styled from "styled-components";

const StyledFilter = styled.span`
    font-size : 13px;
    padding : 8px 16px ;
    cursor:pointer;
    border-width:0px;
    border-radius: 30px;
    
    color : black;
    font-weight: bold;

    ${props => {
        switch(props.variant){
            //location filter
            case 'location' :
                return`
                    background-color : #dcdcdc;
                    color: black;
                `;
            
            //manner Temp 1step(0<12.5)
            case 'worst' : 
                return`
                    background-color : #dcdcdc;
                    color: #696969;
                `;

            //manner Temp 2step(12.5<30)
            case 'bad' :
                return`
                    background-color : rgba(70, 130, 180, 0.3);
                    color: #191970;
                `;   
                
            //manner Temp 3step(default)(30<37.5)
            case 'defTemp' :
                return`
                    background-color : rgba(135, 206, 235, 0.3);
                    color: dodgerblue;
                `;
            
            //manner Temp 4step(37.5<42)
            case 'warm' :
                return`
                    background-color : rgba(102, 205, 170, 0.3);
                    color: mediumseagreen;
                `;
            
            //manner Temp 5step(42<50)
            case 'good' :
                return`
                    background-color : rgba(244, 164, 96, 0.3);
                    color : #ff8c00; 
                `;

            //manner Temp 6step(50<99)
            case 'hot' :
                return`
                    background-color : rgba(255, 127, 80, 0.3);
                    color : orangered;
                `;
        }
    }}
`;

function RoundFilter(props) {
    const {title, onClick, variant} = props;
    return  <StyledFilter titile={title} onClick={onClick} variant={variant}>{title || "filter"}</StyledFilter>  ;  

}

export default RoundFilter;