import React, { useEffect, useState } from "react";
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

  const [product, setProduct] = useState(location.state);

  // 상품 정보 가져오기
  const fetchProductInfo = async () => {
    try {
      const response = await fetch(`/api/usedTrades/${id}`);
      if (!response.ok) {
        throw new Error('상품 정보를 가져오는 데 실패했습니다.');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    fetchProductInfo(); // 컴포넌트가 마운트될 때 상품 정보 가져오기
  }, [id]);

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
        navigate("/usedTrade/used-trade");
      } else {
        alert("해당 물품을 삭제하는 데 실패했습니다.");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert("서버와의 연결에 실패했습니다.");
    }
  }

  const formattedPrice = Intl.NumberFormat('ko-KR').format(product.price); // 가격 포맷팅하기

  return (
    <Container>
      <Header>
        <h2>상품 상세 페이지</h2>
        <ButtonGroup>
          <BackButton onClick={() => navigate("/usedTrade/used-trade")}>뒤로 가기</BackButton>
          <Button onClick={() => navigate(`/usedTrade/used-trade-update/${id}`, { state: product })} title="수정하기" variant="primary" />
          <Button onClick={handleDelete} title="삭제하기" variant="danger" />
        </ButtonGroup>
      </Header>
      <ProductDetail>
        <ProductImage>상품 사진</ProductImage>

        <ProductInfo>
          <Title>{product.name}</Title>
          <Price>{formattedPrice} 원</Price>

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
