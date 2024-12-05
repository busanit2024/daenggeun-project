import React from 'react';
import styled from 'styled-components';

const ItemContainer = styled.div`
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Content = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CommunityListItem = ({ community }) => {
  const { title, content, createdDate, location, likeCount, commentCount, images, category } = community;

  const timeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000 / 60); // 분 단위
    return diff < 60 ? `${diff}분 전` : `${Math.floor(diff / 60)}시간 전`;
  };

  return (
    <ItemContainer>
      <Title>{title}</Title>
      <Content>{content.length > 50 ? `${content.substring(0, 50)}...` : content}</Content>
      {images && images.length > 0 && <img src={images[0]} alt="첨부 이미지" style={{ width: '100%', borderRadius: '8px' }} />}
      <div>{location}</div>
      <div>{timeAgo(createdDate)}</div>
      <div>좋테고리: {category}</div>
      <div>좋아요: {likeCount} | 댓글: {commentCount}</div>
    </ItemContainer>
  );
};

export default CommunityListItem;