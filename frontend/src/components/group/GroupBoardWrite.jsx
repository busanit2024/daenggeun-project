import { useOutletContext } from "react-router-dom";
import { Container, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import Switch from "../ui/Switch";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

const CustomSelect = styled.select`
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
`;

const WriteHeader = styled.div`
margin-top: 16px;
padding-bottom: 16px;
border-bottom: 1px solid #e0e0e0;
  width: 100%;
  display: flex;
  justify-content: space-between;

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

const CustomTextArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 8px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 16px;
  resize: none;
  border-bottom: 1px solid #e0e0e0;
`;

const ImageUpload = styled.div` 
  display: flex;
  gap: 8px;
`;

const CustomFileUpload = styled.input`
  display: none; 

  & + label {
    width: 100px;
    height: 100px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;


export default function GroupBoardWrite() {
  const { group, membersLoaded } = useOutletContext();
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({
    groupId: group.id,
    userId: '',
    content: '',
    board: group.boards?.[0],
    isPrivate: false,
    images: [],
  });

  useEffect(() => {
    console.log(group)
    const uid = sessionStorage.getItem('uid');
    if (!uid) {
      console.log('로그인이 필요합니다.');
      return;
    }
    setInput({
      ...input,
      userId: uid,
    });
    if (membersLoaded) {
      const currentMember = group.members?.find((member) => member.userId === uid);
      setMember(currentMember);
      setLoading(false);
    }
  }, [membersLoaded]);


  return (
    <Container>
      <InnerContainer>
        <div>
          <h3 className="title">글쓰기</h3>
          <p>{group.title}</p>

          {loading && <div>사용자 정보 로딩중...</div>}

          {!loading && (
            <WriteHeader>
              <div className="profile">
                <div className="profile-image">
                  <img src={member?.profileImage?.url ?? '/images/defaultProfileImage.png'} onError={(e) => e.target.src = '/images/defaultProfileImage.png'} alt="프로필 이미지" />
                </div>

                <div className="profile-name">
                  <span>{member?.username}</span>
                  <span>{group.useNickname && `(${member?.groupNickName})`}</span>

                </div>
              </div>

              <div className="options">
                <CustomSelect name="board" id="board" value={input.board} onChange={(e) => setInput((prev) => ({ ...prev, board: e.target.value }))}>
                  {
                    group.boards?.map((board) => (
                      <option key={board} value={board}>{board}</option>
                    ))
                  }
                </CustomSelect>
                <div className="switch">
                  <label htmlFor="private">멤버만 공개</label>
                  <Switch id="private" value={input.isPrivate} onChange={(e) => setInput((prev) => ({ ...prev, isPrivate: e.target.checked }))} />
                </div>

              </div>
            </WriteHeader>
          )}
        </div>

        <CustomTextArea value={input.content} onChange={(e) => setInput((prev) => ({ ...prev, content: e.target.value }))} placeholder="질문이나 이야기를 남겨보세요." />

        <ImageUpload>
          <CustomFileUpload type="file" id="image" multiple />
          <label htmlFor="image">이미지 업로드</label>

        </ImageUpload>

        <Button title={'글쓰기'} variant='primary'></Button>

      </InnerContainer>

    </Container >
  );
}