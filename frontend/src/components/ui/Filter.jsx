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

    ${props => {
        switch(props.variant){
            //매너온도 1단계(0-12.5)
            case 'worst' : 
                return`
                    background-color : #a9a9a9;
                    color: #696969;
                `;

            //매너온도 2단계(12.5-30)
            case 'bad' :
                return`
                    background-color : #4682b4;
                    color: #191970;
                `;   
                
            //매너온도 3단계(기본)(30-41)
            case 'defTemp' :
                return`
                    background-color : skyblue;
                    color: dodgerblue;
                `;
            
            //매너온도 4단계(41-42)
            case 'warm' :
                return`
                    background-color : mediumaquamarine;
                    color: mediumseagreen;
                `;
            
            //매너온도 5단계(42-50)
            case 'good' :
                return`
                    background-color : #f4a460;
                    color : #ff8c00; 
                `;

            //매너온도 6단계(50-99)
            case 'hot' :
                return`
                    background-color : coral;
                    color : orangered;
                `;
        }
    }}
`;

function Filter(props) {
    const {title, onClick} = props;
    return  <StyledFilter titile={title} onClick={onClick}>{title || "filter"}</StyledFilter>  ;  

}

export default Filter;