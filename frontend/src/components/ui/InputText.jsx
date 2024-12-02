import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
    padding : 8px 16px;
    border : 1px solid #ccc;
    border-radius : 5px;
    font-size : 16px;
    
    &:focus {
        border : 1px solid #000000;
        outline : none;
    }
`;

function InputText(props) {
    const { value, onChange, placeholder} = props;
    return (
        <StyledInput 
        type="text" 
        value={value}
        onChange={onChange}
        placeholder={placeholder} />
    );
}

export default InputText;
