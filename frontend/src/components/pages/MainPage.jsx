
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from "react-responsive-carousel";
import imageData from "../../asset/imageData";
import "../../styles/carouselOverrides.css"
import SearchBar from "../ui/SearchBar";
import categoryData from "../../asset/categoryData";
import { useArea } from "../../context/AreaContext";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    max-width: 100%; 
    margin: 0 auto; 
    padding: 0; 
`;

const FullWidthBackground = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw; 
    position: relative; 
    left: 50%;
    right: 50%; 
    margin-left: -50vw; 
    margin-right: -50vw; 
`;

const CategoryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    margin-top: 24px;
    width: 100%;
    max-width: 1280px;
    padding: 0 64px;

    
    & h2 {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 24px;
    }

    & .category-wrapper {
        display: flex;
        gap: 24px;
        width: 100%;
        position: relative;
    }

`;

const CategoryContainer = styled.div`

    display: flex;
        gap: 24px;
        width: 100%;
        overflow-x: auto;
        scroll-behavior: smooth;

        &::-webkit-scrollbar {
            display: none;
        }
    

    &::before,
    &::after {
        content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 10px;
    pointer-events: none;
    z-index: 1;
    }

    &::before {
        display: ${props => props.start ? "none" : "block"};
        left: 0;
        background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }

    &::after {
        display: ${props => props.end ? "none" : "block"};
        right: 0;
        background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }
`;


const ArrowButton = styled.div`
    display: ${props => props.hidden ? "none" : "flex"};
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    background-color: #ffffff;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    z-index: 10;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.1s;
    opacity: 0;

    &:hover {
        opacity: 1;
    }

    &:first-child {
        
        left: 0;
        transform: translate(-50%, -50%);
    }

    &:last-child {
        right: 0;
        transform: translate(50%, -50%);
    }
`;

const Category = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;


    & .category-image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #F2F3F6;
        border: 1px solid #E9EBF0;
        margin-bottom: 12px;
        padding: 36px;

        &:hover img {
            transform: scale(1.1);
        }

        img {
            transition: all 0.2s;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    & .category-name {
        font-size: 14px;
        font-weight: bold;
    }
`;

const StyledCarousel = styled(Carousel)`
    width: 100%;
    margin: 0;
    margin-top : 20px;
    display: flex;
    justify-content: center;
    align-items: center;

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
        justify-self: start;
        padding-left: 64px;
    }

    .carousel .control-arrow.control-next {
        justify-self: end;
        padding-right: 64px;
    }

    .carousel .control-arrow svg {
        fill: black !important;
    }
`;

const Slide = styled.div`
    width: 100%; 
    height: 470px; 
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: ${props => props.color};
`;

const SlideImage = styled.div`
    max-width: 1280px;
    display: flex;
    position: absolute; 
    width: 100%;
    height: 100%;

    img {
        width: 100%; 
        height: 100%; 
        object-fit: cover;
    }
`;

const SlideText = styled.div`
    padding: 0 64px;
    max-width: 1280px;
    display: flex;
    position: absolute; 
    padding: 0 64px;
    width: 100%;
    height: 100%;


    .slideText {
    position: absolute;
    top : 50px;
    font-family : 'SBAggroB';
    color: black;
    text-align: left ;
}


`;

function MainPage(props) {
    const navigate = useNavigate();
    const categoryContainerRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (categoryContainerRef.current.scrollLeft === 0) {
                setIsAtStart(true);
            } else {
                setIsAtStart(false);
            }

            if (categoryContainerRef.current.scrollLeft + categoryContainerRef.current.clientWidth === categoryContainerRef.current.scrollWidth) {
                setIsAtEnd(true);
            } else {
                setIsAtEnd(false);
            }
        };

        categoryContainerRef.current.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            if (categoryContainerRef.current) {
            categoryContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleScrollLeft = () => {
        categoryContainerRef.current.scrollBy({
            left: -1100,
            behavior: "smooth"
        });
    };

    const handleScrollRight = () => {
        categoryContainerRef.current.scrollBy({
            left: 1100,
            behavior: "smooth"
        });
    };

    return (
        <Wrapper>
            <FullWidthBackground>
                <StyledCarousel
                    showArrows={true}
                    autoPlay={true}
                    infiniteLoop={true}
                    showThumbs={false}
                    transitionTime={700}
                >
                    {imageData.map(image => (
                        <Slide key={image.alt} color={image.color}>
                            <SlideImage>
                                <img src={image.src} alt={image.alt} />
                            </SlideImage>
                            <SlideText>
                                <span className="slideText">{image.text}</span>
                                    </SlideText>
                        </Slide>
                    ))}
                </StyledCarousel>
                <CategoryWrapper>
                    <h2>인기 카테고리</h2>
                    <div className="category-wrapper">
                        <ArrowButton className="arrow-button" hidden={isAtStart} onClick={handleScrollLeft}>
                            <img src="/images/icon/arrow_left.svg" alt="왼쪽으로 이동" />
                        </ArrowButton>
                        <CategoryContainer className="category-container" ref={categoryContainerRef} start={isAtStart} end={isAtEnd}>
                            {categoryData.map(category => (
                                <Category onClick={() => navigate(`/usedTrade?category=${category.name}`)}>
                                    <div className="category-image">
                                        <img src={category.image} alt={category.name} />
                                    </div>
                                    <div className="category-name">{category.name}</div>
                                </Category>
                            ))}
                        </CategoryContainer>
                        <ArrowButton className="arrow-button" hidden={isAtEnd} onClick={handleScrollRight}>
                            <img src="/images/icon/arrow_right.svg" alt="오른쪽으로 이동" />
                        </ArrowButton>
                    </div>
                </CategoryWrapper>
            </FullWidthBackground>
        </Wrapper>
    );
}

export default MainPage;