import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaRegHeart, FaRegComment, FaBookmark} from "react-icons/fa";

const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  cursor: pointer;

  &:hover img {
    transform: scale(1.1);
    transition: transform 0.3s;
  }
`;
const CommunityContainer = styled(Container)`
  // CommunityListItem에 필요한 추가 스타일이 있다면 여기에 작성
`;

const ImageContainer = styled.div`
  width: 86px;
  height: 86px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;

  & img {
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

const Title = styled.h2`
  font-size: 20px;
  font-style: normal;
  margin: 0;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 4px;
  color: #666666;
`;

const ContentPreview = styled.p`
  margin: 0;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; // 첫 줄만 표시
`;

const IconContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export default function CommunityListItem({ community }) {
  const navigate = useNavigate();
  const timeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 60000); // 분 단위로 변환
    return `${diff}분 전`;
  };

  return (
    <CommunityContainer key={community.id} onClick={() => navigate(`/community/view/${community.id}`)}>
      {community.image && (
        <ImageContainer>
          <img src={community.image.url} alt={community.title} />
        </ImageContainer>
      )}
      <TextContainer>
        <Title>{community.title}</Title>
        <ContentPreview>{community.content}</ContentPreview>
        <TagContainer>
          <span>{community.location.dong ?? community.location.gu}</span>
          <span> · </span>
          <span>{community.category}</span>
          <span> · </span>
          <span>{timeAgo(community.createdAt)}</span>
        </TagContainer>
        <IconContainer>
          <span>{community.likes?.length ?? 0} <FaRegHeart /></span>
          <span>{community.comments?.length ?? 0} <FaRegComment /></span>
          <span><FaBookmark /></span>
        </IconContainer>
      </TextContainer>
    </CommunityContainer>
  );
}