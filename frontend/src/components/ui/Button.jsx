import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding : 8px 16px ;
    font-size : 16px;
    font-weight: 500;
    border-width: 0px;
    border-radius: ${props => props.borderRadius || "5px"};
    cursor:pointer;
    height : 40px;
    width: ${props => props.width ? props.width : "auto"};
    flex-grow: ${props => props.grow ? 1 : 0};
    
    ${props => {
        if (props.active) {
            return `
                background-color: #000000;
                color: #ffffff;
            `
        }

        if (props.disabled) {
            return `
                background-color: #dcdcdc;
                color: #666666;
                cursor: default;
            `
        }

        switch(props.variant){
            case 'gray' : 
                return `
                  background-color : #dcdcdc;
                  color : black;
                `;
            
            // carrot colored button
            case 'primary' :
                return `
                    background-color : #ff6f0f;
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
                    background-color : #FFEBDD;
                    color : #FF6F0F;
                `;

            case 'danger' :
                return `
                    background-color : #a50000;
                    color : white;
                `;

            case 'findLocation' :
                return `
                    background-color : #FFEBDD;
                    color : #FF6F0F;
                `;
            default:
                return ``;
        };
    }}
`;


function Button(props) {
    const { title, onClick, variant, width, grow, borderRadius, active, disabled, style } = props;
    return <StyledButton
            title={title}
            onClick={onClick}
            variant={variant}
            width={width}
            grow={grow}
            borderRadius={borderRadius}
            active={active}
            disabled={disabled}
            style={style}
        >
            {title || "button"}
        </StyledButton>;
}


export default Button;