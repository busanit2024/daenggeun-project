import { useNavigate, useOutletContext } from "react-router-dom";
import { Container, FlexContainer, InnerContainer } from "./GroupPageLayout";
import Button from "../ui/Button";
import PostListItem from "./PostListItem";
import { useState } from "react";
import styled from "styled-components";
import RoundFilter from "../ui/RoundFilter";

const BoardContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export default function GroupBoard() {
  const { group } = useOutletContext();
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState('전체');
  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">게시글 {group.posts?.length ?? 0}</h3>
          <Button title='글쓰기' onClick={() => navigate('write')}  />
        </div>
        <BoardContainer>
            <RoundFilter title="전체" variant={selectedBoard === '전체' ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard('전체')} />
          { group.boards?.map((board) => (
            <RoundFilter key={board} title={board} variant={selectedBoard === board ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard(board)} />
          ))}
          </BoardContainer>

        <FlexContainer>
          <PostListItem />
          <PostListItem />
        </FlexContainer>


        <Button title={'더 보기'}></Button>
      </InnerContainer>

    </Container>

  );
}