import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  cursor: pointer;

  &:hover img {
  }
`;

const ImageContainer = styled.div`
  width: 86px;
  height: 86px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  flex-grow: 1;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 4px;
  color: #666666;
`;

const Title = styled.h2`
  font-size: 20px;
  font-style: normal;
  margin: 0;
`;

const Description = styled.p`
  margin: 0;
  color: #333333;
`;

export default function GroupListItem({ group }) {
  const navigate = useNavigate();
  return (
    <Container key={group.id} onClick={() => navigate(`/group/view/${group.id}`)}>
      <ImageContainer>
        <img src={group.image} alt={group.title} />
      </ImageContainer>
      <TextContainer>
        <Title>{group.title}</Title>
        <Description>{group.description}</Description>
        <TagContainer>
          <span>{group.location.dong ?? group.location.gu}</span>
          <span> · </span>
          <span>{group.members?.length ?? 0}</span>
          <span> · </span>
          <span>{group.category}</span>

        </TagContainer>
      </TextContainer>
      </Container>
  );

}