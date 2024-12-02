import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
    border: 1px solid #ddd;
    border-radius: 9px;
    overflow: hidden;
    background: #fff;
`;

const ImagePlaceholder = styled.div`
    background: #eee;
    height: 150px;
`;

const Info = styled.div`
    padding: 8px;
`;

const Title = styled.h3`
    font-size: 16px;
    margin: 0;
`;

const Price = styled.div`
    font-size: 16px;
    margin: 0;
    font-weight: bold;
`;

const Location = styled.p`
    font-size: 14px;
    color: #888;
    margin: 4px 0 0;
`

const Card = ({ title, price, location, onClick }) => {
    return (
        <CardContainer onClick={onClick} style={{cursor: "pointer"}}>
            <ImagePlaceholder />
            <Info>
                <Title>{title}</Title>
                <Price>{price}</Price>
                <Location>{location}</Location>
            </Info>
        </CardContainer>
    );
};

export default Card;
