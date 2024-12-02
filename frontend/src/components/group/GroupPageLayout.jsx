import styled from "styled-components";
import SquareFilter from "../ui/SquareFilter";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  padding: 16px;

  .group-header {
    display: flex;
    gap: 16px;
    padding-bottom: 24px;
    border-bottom: 1px solid #dcdcdc;
  }

  .group-image {
    width: 64px;
    height: 64px;
    overflow: hidden;
    border-radius: 8px;
    background-color: #dcdcdc;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .group-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    h2 {
      margin: 0;
    }
    .group-info-detail {
      font-size: 14px;
      display: flex;
      gap: 8px;
      color: #666666;
    }
  }
`;

const GroupDescContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
  width: 100%;

  & .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  & .group-desc {
    white-space: pre-wrap;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
`;

export default function GroupPageLayout(props) {
  const { group } = props;
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDeleteGroup = () => {
    axios.delete(`/api/group/delete/${group.id}`).then((response) => {
      console.log(response.data);
      setDeleted(true);
    })
      .catch((error) => {
        console.error("모임 삭제에 실패했습니다." + error);
      });
  };


  return (
    <Container>
      <SideBar>
        <div className="group-header">
          <div className="group-image">
            <img src={group.image?.url} alt={group.title} />
          </div>
          <div className="group-info">
            <h2>{group.title}</h2>
            <div className="group-info-detail">
              <span>멤버 {group.members?.length ?? 0}</span>
              <span> · </span>
              <span>게시글 {group.posts?.length ?? 0}</span>
            </div>
          </div>
        </div>

        <GroupDescContainer>
          <div className="group-desc">
            {group.description}
          </div>
          <div className="tags">
            <SquareFilter title={group.location?.dong ?? group.location?.gu} variant="tag" />
            <SquareFilter title={group.category} variant="tag" />
            {group.ageRange && <SquareFilter title={group.ageRange} variant="tag" />}
          </div>
          <Button title="입장하기" variant="primary" />
          <ButtonGroup>
            <Button title="모임 수정" grow onClick={() => navigate(`/group/edit/${group.id}`)} />
            <Button title="모임 삭제" grow onClick={() => setModalOpen(true)} />
          </ButtonGroup>
        </GroupDescContainer>


      </SideBar>
      {props.children}

      <Modal title="모임 삭제" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {deleted && <>
          <h2 style={{ margin: 0 }}>{group.title} 모임이 삭제되었습니다.</h2>
          <Button title="모임 리스트로 돌아가기" onClick={() => { setModalOpen(false); setDeleted(false); navigate("/group") }} />
        </>}
        {!deleted && <>
          <h2 style={{ margin: 0 }}>{group.title} 모임을 삭제하시겠어요?</h2>
          <p style={{ margin: 0 }}>모임을 삭제하면 되돌릴 수 없어요.</p>
          <ButtonGroup>
            <Button title="삭제" grow variant="danger" onClick={handleDeleteGroup} />
            <Button title="취소" grow onClick={() => setModalOpen(false)} />
          </ButtonGroup>
        </>}

      </Modal>
    </Container>
  );

}