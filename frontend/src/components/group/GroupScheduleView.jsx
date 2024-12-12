import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Container, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import Switch from "../ui/Switch";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import axios from "axios";
import { deleteFiles, multipleFileUpload } from "../../firebase";
import { calculateDate } from "../../utils/calculateDate";
import { ButtonContainer } from "../pages/Group/GroupCreatePage";

const ViewHeader = styled.div`
margin-top: 16px;
padding-bottom: 16px;
border-bottom: 1px solid #e0e0e0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .profile {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .profile-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .profile-name {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .options {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .switch {
    display: flex;
    gap: 4px;
    align-items: center;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: 400px;
  padding: 8px 8px 24px 8px;
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 16px;
  resize: none;
  border-bottom: 1px solid #e0e0e0;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  margin-top: 24px;

  img {
    max-width: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  font-size: 14px;
  color: #666666;
  display: flex;
  gap: 4px;
`;


export default function GroupScheduleView () {
  const { group, membersLoaded } = useOutletContext();
  const naviagte = useNavigate();
  const { postId } = useParams();
  const [member, setMember] = useState([]);
  const [post, setPost] = useState({});
  const [isMyPost, setIsMyPost] = useState(false);

  useEffect(() => {
    if (!postId || !membersLoaded) {
      return;
    }
    axios.get(`/api/group/board/post/${postId}`, {params:
      {view: true}
    }).then((response) => {
      const newPost = response.data;
      setPost({ ...newPost, user: group.members.find((member) => member.userId === newPost.userId) });
      const userId = sessionStorage.getItem('uid');
      if (newPost.userId === userId) {
        setIsMyPost(true);
      }
      console.log(newPost);
    }).catch((error) => {
      console.error('게시글을 불러오는데 실패했습니다.' + error);
    });
  }, [postId, membersLoaded]);


  const handleDelete = () => {
    const filenames = post.images.map((image) => image.filename);

    axios.post(`/api/group/board/delete`, post).then((response) => {
      deleteFiles(filenames).then(() => {
        alert('게시글을 삭제했어요.');
        naviagte(`/group/${group.id}/board`);
      }).catch((error) => {
        console.error('파일을 삭제하는데 실패했습니다.' + error);
      });
    }).catch((error) => {
      console.error('게시글을 삭제하는데 실패했습니다.' + error);
    });
  };


  return (
    <Container>
      <InnerContainer>
        <div>
          <h3 className="title">게시글</h3>
          <p>{group.title}</p>


          <ViewHeader>
            <div className="profile">
              <div className="profile-image">
                <img src={post?.user?.profileImage?.url ?? '/images/defaultProfileImage.png'} onError={(e) => e.target.src = '/images/defaultProfileImage.png'} alt="프로필 이미지" />
              </div>

              <div className="profile-name">
                <span>{post?.user?.username ?? '작성자'}</span>
                <span>{group.useNickname && `(${post?.user?.groupNickName ?? '별명'})`}</span>

              </div>
            </div>
            <Info>
              <span>조회 {post?.view ?? 0}</span>
              <span> · </span>
              <span>{post?.createdDate ? calculateDate(post.createdDate) + ' 전' : '작성일'}</span>
              <span> · </span>
              <span>{post.board ?? '게시판이름'}</span>
            </Info>
          </ViewHeader>

        </div>
        <Content>
          {post?.content ?? '게시글 내용'}
          {post?.images?.length > 0 && <ImageContainer>
            {post?.images?.map((image) => (
              <img key={image.filename} src={image.url} alt="게시글 이미지" />
            ))}
          </ImageContainer>
          }
        </Content>

        {isMyPost && <ButtonContainer>
          <Button title="수정" onClick={() => naviagte(`edit`)} />
          <Button title="삭제" variant="danger" onClick={handleDelete} />
        </ButtonContainer>}
      </InnerContainer>

    </Container >
  );
}