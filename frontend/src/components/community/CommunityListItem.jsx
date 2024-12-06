import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { elapsedText } from "../../utils/elapsedText";

const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  cursor: pointer;

  &:hover .group-image {
    transform: scale(1.1);
    transition: transform 0.3s;
  }
`;

const ImageContainer = styled.div`
  width: 86px;
  height: 86px;
  flex-shrink: 0;
  background-color: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;

  & .group-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  flex-grow: 1;
`;

const TagContainer = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666666;

  & span {
    display: flex;
    align-items: center;
    gap: 2px;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-style: normal;
  margin: 0;
`;

const Content = styled.p`
  font-size: 15px;
  margin: 0;
  color: #555555;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  width: 35ch;
  white-space: nowrap;
  word-wrap: break-word;
`;

export default function CommunityListItem({community}) {
  const navigate = useNavigate();
  return (
    <Container key={community.id} onClick={() => navigate(`/community/${community.id}`)}>
      <TextContainer>
        <Title>{community.title}</Title>
        <Content>{community.content}</Content>
        <TagContainer>
          <span>{community.location.emd ?? community.location.sigungu}</span>
          <span> · </span>
          <span>{community.category}</span>
          <span> · </span>
          <span>{elapsedText(new Date(community.createdDate))}</span>
        </TagContainer>
      </TextContainer>
      <ImageContainer>
        {community.image?.url &&
          <image className="community-image" src={community.image?.url} alt={community.title} />
        }
      </ImageContainer>
    </Container>
  )
}