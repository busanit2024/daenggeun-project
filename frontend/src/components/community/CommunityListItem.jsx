import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { elapsedText } from "../../utils/elapsedText";

const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  cursor: pointer;

  &:hover .community-image {
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

  & .community-image {
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
`;

export default function CommunityListItem({ community }) {
  const navigate = useNavigate();
  const firstImage = community.images?.length > 0 ? community.images?.[0]?.url : '/images/default/defaultGroupImage.png';

  return (
    <Container key={community.id} onClick={() => navigate(`/community/${community?.id}`)}>
      
      <TextContainer>
        <Title>{community.title}</Title>
        <Content>{community.content}</Content>
        <TagContainer>
          <span>
            <img height={16} src="/images/icon/location_gray.svg" alt="location" />
            {community.location?.emd ?? community.location?.sigungu}</span>
          <span> · </span>
          <span>{community.category}</span>
          <span> · </span>
          {elapsedText(new Date(community.createdDate))}

        </TagContainer>
      </TextContainer>
      <ImageContainer>
        <img
          className="community-image"
          src={community.images?.length > 0 ? community.images?.[0]?.url : '/images/default/defaultGroupImage.png'}
          alt={community.title}
          onError={(e) => e.target.src = '/images/default/defaultGroupImage.png'}
        />
      </ImageContainer>
    </Container>
  );

}