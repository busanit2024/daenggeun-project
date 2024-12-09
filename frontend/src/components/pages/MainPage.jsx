import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from "react-responsive-carousel";
import imageData from "../../asset/imageData";
import "../../styles/carouselOverrides.css"
import SearchBar from "../ui/SearchBar";

const categoryData = [
    { name: "디지털기기", image: "/images/category/digital.png" },
    { name: "생활가전", image: "/images/category/living.png" },
    { name: "가구/인테리어", image: "/images/category/furniture.png" },
    { name: "생활/주방", image: "/images/category/kitchen.png" },
    { name: "유아동", image: "/images/category/baby.png" },
    { name: "유아도서", image: "/images/category/babyBook.png" },
    { name: "여성의류", image: "/images/category/clothes.png" },
    { name: "여성잡화", image: "/images/category/accessory.png" },
    { name: "남성패션/잡화", image: "/images/category/men.png" },
    { name: "뷰티/미용", image: "/images/category/beauty.png" },
    { name: "스포츠/레저", image: "/images/category/sport.png" },
    { name: "취미/게임/음반 ", image: "/images/category/hobby.png" },
    { name: "도서", image: "/images/category/book.png" },
    { name: "티켓/교환권", image: "/images/category/ticket.png" },
    { name: "가공식품", image: "/images/category/food.png" },
    { name: "건강기능식품", image: "/images/category/health.png" },
    { name: "반려동물용품", image: "/images/category/pet.png" },
    { name: "식물", image: "/images/category/plant.png" },
    { name: "기타 중고물품", image: "/images/category/etc.png" },
    { name: "삽니다", image: "/images/category/buy.png" },
];


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
    width: 100vh;
    min-width: 1280px;
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
            categoryContainerRef.current.removeEventListener('scroll', handleScroll);
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
                <CategoryWrapper>
                    <h2>인기 카테고리</h2>
                    <div className="category-wrapper">
                        <ArrowButton className="arrow-button" hidden={isAtStart} onClick={handleScrollLeft}>
                            <img src="/images/icon/arrow_left.svg" alt="왼쪽으로 이동" />
                        </ArrowButton>
                        <CategoryContainer className="category-container" ref={categoryContainerRef} start={isAtStart} end={isAtEnd}>
                            {categoryData.map(category => (
                                <Category>
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