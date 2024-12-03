import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
    padding : 8px 16px;
    border : 1px solid #ccc;
    border-radius : 5px;
    font-size : 16px;

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
    const { value, onChange, placeholder, underline, grow } = props;
    return (
        <StyledInput
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            underline={underline}
            grow={grow} />
    );
}

export default InputText;
