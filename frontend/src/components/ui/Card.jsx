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
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #888;
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

const Image = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
`;

const Card = ({ title, price, location, onClick, imageUrl }) => {
    return (
        <CardContainer onClick={onClick} style={{cursor: "pointer"}}>
            {imageUrl ? (
                <Image src={imageUrl} alt={title} />
            ) : (
                <ImagePlaceholder>No Image Available</ImagePlaceholder>
            )}
            <Info>
                <Title>{title}</Title>
                <Price>{price}</Price>
                <Location>{location}</Location>
            </Info>
        </CardContainer>
    );
};

export default Card;
