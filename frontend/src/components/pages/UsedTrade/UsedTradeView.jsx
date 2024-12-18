import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";
import imageData from "../../../asset/imageData";
import categoryData from "../../../asset/categoryData";
import Breadcrumb from "../../ui/Breadcrumb";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 36px 0px;

`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px; /* 버튼 간의 간격 조정 */
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const Product = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
`;

const ProductDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
`;

const ProductImage = styled.div`
  flex: 1;
  background: #eaeaea;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ProductInfo = styled.div`
  flex: 2;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const Location = styled.p`
  font-size: 14px;
  margin-bottom: 20px;
`

const Description = styled.p`
  font-size: 16px;
  color: #555;
  white-space: pre-wrap;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 24px 10px;
  border-radius: 5px;

  min-height: 200px;
`;

const CategoryAndTime = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
`;

const UsedTradeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(location.state);
  const [userId, setUserId] = useState(sessionStorage.getItem('uid'));  // 현재 로그인한 사용자 ID

  // 상품 정보 가져오기
  const fetchProductInfo = async () => {
    try {
      const response = await fetch(`/api/usedTrades/${id}`);
      if (!response.ok) {
        throw new Error('상품 정보를 가져오는 데 실패했습니다.');
      }
      const data = await response.json();
      console.log(data);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    fetchProductInfo(); // 컴포넌트가 마운트될 때 상품 정보 가져오기
  }, [id, userId]);

  if (!product) {
    return (
        <Container>
          <p>상품 정보를 가져오는 중입니다...</p>
        </Container>
    );
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 상품을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/usedTrades/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("삭제가 완료되었습니다.");
        navigate("/usedTrade");
      } else {
        alert("해당 물품을 삭제하는 데 실패했습니다.");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert("서버와의 연결에 실패했습니다.");
    }
  }

  const formattedPrice = Intl.NumberFormat('ko-KR').format(product.price); // 가격 포맷팅하기

  const timeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const difference = Math.floor((now - postTime) / 1000); // 초 단위

    const minutes = Math.floor(difference / 60);
    const hours = Math.floor(difference / 3600);
    const days = Math.floor(difference / 86400);
    const weeks = Math.floor(difference / (86400 * 7));
    const months = Math.floor(difference / (86400 * 30)); // 대략 30일로 계산
    const years = Math.floor(difference / (86400 * 365)); // 대략 365일로 계산

    if (difference < 60) return `${difference}초 전`;
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    if (weeks < 4) return `${weeks}주 전`;
    if (months < 12) return `${months}개월 전`;
    return `${years}년 전`;
};

  const routes = [
    { path: "/", name: "홈" },
    { path: "/usedTradeView/:id", name: "상품 상세 페이지" },
];


  return (
    <>
    <Breadcrumb routes={routes}/>

    <Container>
      <Header>
        <h2>상품 상세 페이지</h2>
        <ButtonGroup>
          <Button title="뒤로가기" onClick={() => navigate("/usedTrade")} />
          {product.userId && userId && product.userId[0].toLowerCase() === userId[0].toLowerCase() && ( // 작성자 ID와 현재 사용자 ID를 비교
            <>
              <Button onClick={() => navigate(`/usedTradeUpdate/${id}`, { state: product })} title="수정하기" variant="primary" />
              <Button onClick={handleDelete} title="삭제하기" variant="danger" />
            </>
          )}
        </ButtonGroup>
      </Header>
      <Product>
        <ProductDetail>
          <ProductImage>
            {product.images ? (
              <StyledImage src={product.images[0].url} alt="상품 이미지" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            ) : (
              "이미지가 없습니다."
            )}
          </ProductImage>
        </ProductDetail>

        <ProductDetail>
          <ProductInfo>
            <Title>{product.name}</Title>
            <CategoryAndTime>
              {product.category} · {timeAgo(product.createdDate)} · {product.isNegotiable ? "네고 가능" : product.price === 0 ? "나눔" : "네고 불가능"}
            </CategoryAndTime>
            <Price>{formattedPrice} 원</Price>
            <Location>{product.location}</Location>

            <Description>
              <pre style={{ fontFamily: "unset" }}>
                {product.content || "설명이 없습니다."}
              </pre>
            </Description>

            <Button 
              title={product.tradeable ? "거래하기" : "이미 거래가 완료된 상품입니다."}
              variant="primary" 
              onClick={product.tradeable ? () => alert("거래를 시작합니다!") : null} 
              style={{ width: "100%", marginTop: "20px" }}
              disabled={!product.tradeable}
            />
          </ProductInfo>
        </ProductDetail>
      </Product>
      
      {/* <MoreProducts>
        <h3>이 판매자의 다른 상품</h3>

        <ProductGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCard key={index}>상품 {index + 1}</ProductCard>
          ))}
        </ProductGrid>

      </MoreProducts> */}
    </Container>
    </>
  );
};

export default UsedTradeView;
