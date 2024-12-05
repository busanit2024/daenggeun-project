import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CommunityViewPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/api/community/${id}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error("글을 불러오는데 실패했습니다.", error);
      });
  }, [id]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <img src={post.imageUrl} alt={post.title} />
      <p>{post.content}</p>
      <p>작성자: {post.author}</p>
      <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default CommunityViewPage;
