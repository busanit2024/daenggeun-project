import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 20px;
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

const ProductDetail = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
`;

const ProductImage = styled.div`
  flex: 1;
  background: #eaeaea;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    
    &:hover {
        background-color: #e55a13;
    }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 20px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
`;

const MoreProducts = styled.div`
  margin-top: 40px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background: #eaeaea;
  padding: 20px;
  text-align: center;
  cursor: pointer;
`;

const UsedTradeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // location.state에서 상품 정보 가져오기
  const product = location.state || { 
    name: "상품 정보가 없습니다", 
    price: "가격 정보가 없습니다",
    content: "상세 설명이 없습니다.",
    location: "위치 정보가 없습니다."
  };

  if (!product) {
    return (
        <div>
            <p>상품 정보가 없습니다.</p>
            <button onClick={() => navigate("/usedTrade/used-trade")}>뒤로 가기</button>
        </div>
    );
  }

  return (
    <Container>
      <Header>
        <h2>상품 상세 페이지</h2>
        <ButtonGroup>
          <BackButton onClick={() => navigate("/usedTrade/used-trade")}>뒤로 가기</BackButton>
          <Button onClick={() => navigate(`/usedTrade/used-trade-update/${id}`, { state: product })} title="수정하기" variant="primary" />
        </ButtonGroup>
      </Header>
      <ProductDetail>
        <ProductImage>상품 사진</ProductImage>

        <ProductInfo>
          <Title>{product.name}</Title>
          <Price>{product.price}원</Price>

          <Description>
            {product.content}
          </Description>

          <ButtonWrapper>
            <Button 
              title="거래하기" 
              variant="primary" 
              onClick={() => alert("거래를 시작합니다!")} />
          </ButtonWrapper>
        </ProductInfo>

      </ProductDetail>
      <MoreProducts>
        <h3>이 판매자의 다른 상품</h3>

        <ProductGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCard key={index}>상품 {index + 1}</ProductCard>
          ))}
        </ProductGrid>

      </MoreProducts>
    </Container>
  );
};

export default UsedTradeView;
