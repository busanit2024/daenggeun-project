import React from "react";
import styled from "styled-components";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from "react-responsive-carousel";
import imageData from "../../asset/imageData";
import "../../styles/carouselOverrides.css"
import SearchBar from "../ui/SearchBar";

const Wrapper = styled.div`
    max-width: 100%; 
    margin: 0 auto; 
    padding: 0; 
`;

const FullWidthBackground = styled.div`
    width: 100vw; 
    position: relative; 
    left: 50%;
    right: 50%; 
    margin-left: -50vw; 
    margin-right: -50vw; 
`;

const StyledCarousel = styled(Carousel)`
    width: 100%;
    margin: 0;
    margin-top : 20px;

    .carousel .control-arrow {
        background-color:transparent;
        border : none;
        font-size:30px;
        z-index :10;
    }

    .carousel .control-arrow:hover {
        background-color: transparent;
    }

    .carousel .control-arrow::before {
        color: black !important;
        font-size: 30px !important;
    }

    .carousel .control-arrow.control-prev {
        left : 10px;
    }

    .carousel .control-arrow.control-next {
        right : 10px;
    }

    .carousel .control-arrow svg {
        fill: black !important;
    }
`;

const Slide = styled.div`
    width: 100%; 
    height: 400px; 
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const SlideImage = styled.img`
    width: 100%; 
    height: 100%; 
    object-fit: cover;
`;

const SlideText = styled.span`
    position: absolute; 
    color: black;
    font-size: 1.5rem;
    text-align: left ;
    left: 25%;
    transform: translateX(-50%);
    top : 50px;
    font-family : SBAggroB;
`;


function MainPage(props) {
    return (
        <Wrapper>
            <SearchBar />
            <FullWidthBackground>
                <StyledCarousel
                    showArrows={true}
                    autoPlay={true}
                    infiniteLoop={true}
                    showThumbs={false}
                    >
                    {imageData.map(image => (
                        <Slide key={image.alt}>
                            <SlideImage src={image.src} alt={image.alt} />
                            <SlideText>{image.text}</SlideText>
                        </Slide>
                    ))}
                </StyledCarousel>
            </FullWidthBackground>
        </Wrapper>
    );
}

export default MainPage ;