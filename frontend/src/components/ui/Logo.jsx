import React from "react";
import styled from "styled-components";

const StyledLogo = styled.img`
   width : 100px;
   height: auto;
   cursor : pointer;
   padding: 14px;
`;

const logoOnly = '/images/logo/logo.png';
const logoWithText = '/images/logo/daenggnlogo.png';
const danggn = '/images/logo/danggn.png';

const Logo = ({variant, onClick}) => {
    let logoSrc;

    switch (variant) {
        case 'logoOnly' :
            logoSrc = logoOnly;
            break;
        case 'logoWithText' :
            logoSrc = logoWithText;
            break;
        case 'danggn' :
            logoSrc = logoWithText;
            break;
        default:
            logoSrc = logoWithText;
    }

    return <StyledLogo src={logoSrc} alt="로고" onClick={onClick} />
};

export default Logo;