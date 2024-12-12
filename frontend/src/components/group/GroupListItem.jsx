import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const Description = styled.p`
  font-size: 15px;
  margin: 0;
  color: #555555;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function GroupListItem({ group }) {
  const navigate = useNavigate();
  const uid = sessionStorage.getItem('uid');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!uid) return;
    if (group.members?.find((member) => member.userId === uid)?.position === 'ADMIN') {
      setIsOwner(true);
    }
  }, [uid]);


  return (
    <Container key={group.id} onClick={() => navigate(`/group/${group.id}`)}>
      <ImageContainer>

        <img className="group-image" src={group.image?.url ?? '/images/default/defaultGroupImage.png'} alt={group.title} onError={(e) => e.target.src = '/images/default/defaultGroupImage.png'} />
      </ImageContainer>
      <TextContainer>
        <Title style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{group.title}
          {isOwner && <span>
            <img height={16} src="/images/icon/group_admin.svg" alt="모임장" />
          </span>}
        </Title>
        <Description>{group.description}</Description>
        <TagContainer>
          <span>
            <img height={16} src="/images/icon/location_gray.svg" alt="location" />
            {group.location.emd ?? group.location.sigungu}</span>
          <span> · </span>
          <span>
            <FaUser size={14} color="#999999" />
            {group.members?.length ?? 0}</span>
          <span> · </span>
          <span>{group.category}</span>

        </TagContainer>
      </TextContainer>
    </Container>
  );

}