import styled from "styled-components";
import { calculateDate } from "../../utils/calculateDate";
import Button from "../ui/Button";
import { useState } from "react";

const CommentContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #ccc;
  width: 100%;
`;

const ProfileImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #dcdcdc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;

  & .profileName { 
    font-weight: bold;
  }

  & .LocationAndDate {
    display: flex;
    gap: 4px;
    color: #666;
  }

  & .content {
    white-space: pre-wrap;
  }

  & .editComment {
    display: flex;
    align-items: end;
    gap: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: start;
`;

const StyledButton = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin: 0;
  text-decoration: underline;

`;

const CommentInput = styled.textarea`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  resize: none;
  height: 88px;
  font-family: inherit;
  font-size: inherit;
`;

export default function CommentListItem({ comment, handleDelete, handleEdit }) {
  const currentUserId = sessionStorage.getItem('uid');
  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState(comment.content);

  const onDelete = () => {
    handleDelete(comment);
  }

  const onEdit = () => {
    setIsEdit(false);
    const editedComment = {
      ...comment,
      content: editComment
    }
    handleEdit(editedComment);
  }

  return(
    <CommentContainer>
      <ProfileImage>
        <img src={comment.user?.profileImage?.url ?? '/images/default/defaultProfileImage.png'} onError={(e) => e.target.src = '/images/default/defaultProfileImage.png'} alt="profile" />
      </ProfileImage>

      <CommentContent>
        <span className="profileName">{comment.user?.username ?? '닉네임'}</span>
        <div className="LocationAndDate">
          <span>{comment.user?.location?.[0]?.emd ?? '지역'}</span>
          <span>·</span>
          <span>{calculateDate(comment.createdDate)} 전</span>
        </div>
        {isEdit && (
          <div className="editComment">
          <CommentInput value={editComment} onChange={(e) => setEditComment(e.target.value)} />
          <Button title="수정" onClick={onEdit} />
          </div>
          
          )}
        {!isEdit && <div className="content">{comment.content}</div>}
      </CommentContent>

      {(currentUserId === comment.userId && !isEdit) && (
      <ButtonContainer>
        <StyledButton onClick={() => setIsEdit(true)}>수정</StyledButton>
        <StyledButton onClick={onDelete}>삭제</StyledButton>
      </ButtonContainer>
      )}

      {isEdit && (
        <ButtonContainer>
          <StyledButton onClick={() => setIsEdit(false)}>취소</StyledButton>
        </ButtonContainer>
      )}
    </CommentContainer>
  );
}