import styled from "styled-components";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import axios from "axios";

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  margin-top: 12px;
  border-top: 1px solid #ccc;
`

const ProfileContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;

  & .profileImage {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #dcdcdc;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .profileName {
    font-weight: bold;
  }

`

const WriteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 36px;
  align-items: end;

  & textarea {
    flex-grow: 1;
    padding: 10px;
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    resize: none;
    height: 100px;
    font-family: inherit;
    font-size: inherit;
  }
`;

export default function CommentWrite({ handleSubmitComment }) {
  const [comment, setComment] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const userId = sessionStorage.getItem('uid');
    if (!userId) return;
    axios.get(`/user/${userId}`).then((response) => {
      setUser(response.data);
    });
  }, []);

  const onSubmitComment = () => {
    handleSubmitComment(comment);
    setComment('');
  }


  return(
    <CommentWrapper>
      <ProfileContainer>
        <div className="profileImage">
          <img src={user?.profileImage?.url ?? `/images/default/defaultProfileImage.png`} onError={(e) => e.target.src = `/images/default/defaultProfileImage.png`}  alt="프로필"/>
        </div>
        <span className="profileName">
          {user?.username ?? '닉네임'}
        </span>
      </ProfileContainer>

      <WriteContainer>
        <textarea placeholder="댓글 쓰기..." value={comment} onChange={(e) => setComment(e.target.value)}/>
        <Button title="등록" onClick={onSubmitComment}/>
      </WriteContainer>
    
    </CommentWrapper>
  );

}