import React from "react";
import styled from "styled-components";
import logoOnly from '../../images/logo.png'; 
import logoWithText from '../../images/Daangn_Signature_RGB.png';

const StyledLogo = styled.img`
   width : 100px;
   height: 65px;
   cursor : pointer;
`;

const Logo = ({variant, onClick}) => {
    let logoSrc;

    switch (variant) {
        case 'logoOnly' :
            logoSrc = logoOnly;
            break;
        case 'logoWithText' :
            logoSrc = logoWithText;
            break;
    }

    return <StyledLogo src={logoSrc} alt="로고" onClick={onClick} />
};

export default Logo;