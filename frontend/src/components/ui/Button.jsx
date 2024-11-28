import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding : 8px 16px ;
    font-size : 16px;
    border-width: 0px;
    border-radius: 5px;
    cursor:pointer;
    
    ${props => {
        switch(props.variant){
            case 'gray' : 
                return `
                  background-color : #dcdcdc;
                  color : black;
                `;
            
            // carrot colored button
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

            case 'login' :
                return `
                    background-color : rgba(255, 69, 0, 0.3);
                    color : rgba(255, 69, 0);
                `;
        };
    }}
`;


function Button(props) {
    const { title, onClick, variant } = props;
    return <StyledButton title={title} onClick={onClick} variant={variant}>{title || "button"}</StyledButton>;
}


export default Button;