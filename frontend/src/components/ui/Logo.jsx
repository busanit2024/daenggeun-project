import React from "react";
import styled from "styled-components";

const StyledLogo = styled.img`
   width : 100px;
   height: 65px;
   cursor : pointer;
`;

const logoOnly = '/images/logo/logo.png';
const logoWithText = '/images/logo/Daangn_Signature_RGB.png';

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