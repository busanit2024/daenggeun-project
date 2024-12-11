import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
    padding : 8px 16px;
    border : 1px solid #ccc;
    border-radius : 5px;
    font-size : 16px;
    flex-grow: ${props => props.grow ? 1 : 0};

    ${props => {
        if (props.underline) {
            return `
                border : none;
                border-bottom : 1px solid #ccc;
                border-radius : 0px;
            `;
        }
    }

    }
    
    &:focus {
        border : 1px solid #000000;
        outline : none;

        ${props => {
        if (props.underline) {
            return `
                border : none;
                border-bottom : 1px solid #000000;
            `;
        }}}
        
    }
`;

function InputText(props) {
    const { name, value, onChange, placeholder, underline, grow , onClick} = props;
    return (
        <StyledInput
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onClick={onClick}
            placeholder={placeholder}
            underline={underline}
            grow={grow} />
    );
}

export default InputText;
