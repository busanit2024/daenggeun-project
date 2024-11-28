import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding : 8px 16px ;
    font-size : 16px;
    border-width: 0px;
    border-radius: 8px;
    cursor:pointer;
    height : 40px;
    
    ${props => {
        switch(props.variant){
            case 'gray' : 
                return `
                  background-color : #dcdcdc;
                  color : black;
                `;

            case 'primary' :
                return `
                    background-color : #ff4500;
                    color : white;
                   
                `;
            case 'white' :
                return `
                    background-color : white;
                    color : black;
                    border-width:1px;
                `;

        };
    }}
`;


function Button(props) {
    const { title, onClick, variant } = props;
    return <StyledButton onClick={onClick} variant={variant}>{title || "button"}</StyledButton>;
}


export default Button;