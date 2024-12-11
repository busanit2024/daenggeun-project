import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Container, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import Switch from "../ui/Switch";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import axios from "axios";
import { deleteFile, deleteFiles, multipleFileUpload } from "../../firebase";

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
  padding: 8px 0;
  display: flex;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
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

const ImagePreview = styled.div`

  position: relative;

  & .imageWrap {
    display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;

  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & .delete {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: black;
    color: white;
    padding: 4px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;


export default function GroupBoardWrite() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { group, membersLoaded } = useOutletContext();
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteImages, setDeleteImages] = useState([]);
  const [input, setInput] = useState({
    groupId: group.id,
    userId: '',
    content: '',
    board: group.boards?.[0],
    isPrivate: false,
    images: [],
  });

  useEffect(() => {
    setIsEditing(currentPath.includes('edit'));
  }, [currentPath]);

  useEffect(() => {
    if (isEditing) {
      axios.get(`/api/group/board/post/${postId}`).then((response) => {
        const post = response.data;
        setInput((prev) => ({
          ...prev,
          content: post.content,
          board: post.board,
          isPrivate: post.isPrivate,
          images: post.images,
          id: postId,
        }));
        setImages(post.images);
      }).catch((error) => {
        console.error('게시글을 불러오는데 실패했습니다.' + error);
      });
    }
  }, [isEditing]);

  useEffect(() => {
    setInput((prev) => ({ ...prev, groupId: group.id, board: group.boards?.[0] }));
  }, [group]);

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

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setImages((prev) => [...prev, ...fileArray]);
  }

  const handleDeleteImage = (image, index) => {
    if (image.filename) {
      setDeleteImages((prev) => [...prev, image.filename]);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const getImageUrl = (image) => {
    if (image.url) {
      return image.url;
    }
    return URL.createObjectURL(image);
  }

  const handleUpload = async () => {

    try {
      await deleteFiles(deleteImages);
      multipleFileUpload(images).then((images) => {
        setInput((prev) => ({ ...prev, images }));
        axios.post('/api/group/board/write', {
          ...input,
          images,
        }).then((response) => {
          console.log(response.data);
          alert(`게시글을 ${isEditing ? '수정' : '작성'}했어요.`);
          navigate('/group/' + group.id + '/board');
        }).catch((error) => {
          console.error('서버 저장에 실패했습니다.' + error);
          deleteFiles(images.map((image) => image.filename));
        });
      }).catch((error) => {
        console.error('이미지 업로드에 실패했습니다.' + error);
      });
    } catch (error) {
      console.error('글쓰기에 실패했습니다.' + error);
      alert(`${isEditing ? '게시글 수정' : '글쓰기'}에 실패했습니다. 다시 시도해주세요.`);
    }
  };


  return (
    <Container>
      <InnerContainer>
        <div>
          <h3 className="title">{isEditing ? '게시글 수정하기' : '글쓰기' }</h3>
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
          <CustomFileUpload type="file" id="image" multiple onChange={handleImageUpload} />
          <label htmlFor="image">
            <img src="/images/icon/camera.svg" alt="이미지 업로드" />
          </label>

          {images.map((image, index) => (
            <ImagePreview key={index}>
              <div className="imageWrap">
                <img src={getImageUrl(image)} alt="이미지 미리보기" />
              </div>
              <div className="delete" onClick={() => handleDeleteImage(image, index)}>

                <img src="/images/icon/cancel.svg" alt="삭제" />
              </div>
            </ImagePreview>
          ))}


        </ImageUpload>

        <Button title={`${isEditing ? '수정하기' : '글쓰기'}`} variant='primary' onClick={handleUpload}></Button>

      </InnerContainer>

    </Container >
  );
}