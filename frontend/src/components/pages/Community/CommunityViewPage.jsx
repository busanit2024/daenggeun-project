import axios from "axios";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "../../ui/Toolbar"; // 툴바 컴포넌트
import Button from "../../ui/Button"; // 버튼 컴포넌트
import Profile from "../../ui/Profile"; // 프로필 컴포넌트
import ImagePreview from "../../ui/ImagePreview"; // 이미지 미리보기 컴포넌트

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentContainer = styled.div`
  padding: 16px;
`;

const CategoryTitle = styled.h2`
  margin: 16px 0;
`;

const PostContainer = styled.div`
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const TimeAgo = styled.span`
  color: #666666;
  font-size: 14px;
`;

export default function CommunityViewPage() {
  const navigate = useNavigate();
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [post, setPost] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    // 글 정보 가져오기
    axios.get(`/api/community/${postId}`).then((response) => {
      setPost(response.data);
      setCategory(response.data.category); // 카테고리 설정
    }).catch((error) => {
      console.error("글 정보를 불러오는데 실패했습니다." + error);
    });
  }, [postId]);

  if (!post) {
    return <div>로딩 중...</div>; // 데이터 로딩 중 표시
  }

  const { author, title, content, createdAt, image } = post;

  return (
    <Container>
      <Toolbar title="커뮤니티 글 보기" onBack={() => navigate("/community")} />
      <ContentContainer>
        <CategoryTitle>{category}</CategoryTitle>
        <PostContainer>
          <Profile 
            image={author.profileImage} 
            nickname={author.nickname} 
            location={author.location} 
            timeAgo={`${Math.floor((new Date() - new Date(createdAt)) / 1000 / 60)}분 전`} 
          />
          <h3>{title}</h3>
          <p>{content}</p>
          {image && <ImagePreview src={image} alt="첨부 이미지" />}
        </PostContainer>
      </ContentContainer>
    </Container>
  );
}