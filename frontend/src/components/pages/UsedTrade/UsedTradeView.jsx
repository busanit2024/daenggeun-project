import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  return (
    <Container>
      <Header>
        <h2>상품 상세 페이지</h2>
        <BackButton onClick={() => navigate(-1)}>뒤로 가기</BackButton>
      </Header>
      <ProductDetail>
        <ProductImage>상품 사진</ProductImage>

        <ProductInfo>
          <Title>제목: 상품 {id}</Title>
          <Price>가격: 50,000원</Price>

          <Description>
            상세 설명: 이 상품은 {id}번 상품으로 상세 내용은 여기에 표시됩니다.
          </Description>

          <Button title="거래하기" variant="primary" onClick={() => alert("거래를 시작합니다!")} />
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
