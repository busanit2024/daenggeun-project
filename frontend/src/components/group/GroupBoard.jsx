import { useNavigate, useOutletContext } from "react-router-dom";
import { Container, FlexContainer, InnerContainer } from "./GroupPageLayout";
import Button from "../ui/Button";
import PostListItem from "./PostListItem";
import { useEffect, useState } from "react";
import styled from "styled-components";
import RoundFilter from "../ui/RoundFilter";
import axios from "axios";

const BoardContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export default function GroupBoard() {
  const { group, membersLoaded } = useOutletContext();
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [isMember, setIsMember] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem('uid');
    if (!membersLoaded) return;
    const member = group.members?.find((member) => member.userId === userId);
    if (member) {
      setIsMember(true);
    }
  } , [group, membersLoaded]);

  useEffect(() => {
    fetchBoards(0);
  }, [group, selectedBoard]);

  const fetchBoards = (page) => {
    axios.get(`/api/group/board/${group.id}`, {params: {
      boardName: selectedBoard,
      page: page,
      size: 10,
    }}).then((response) => {
      const newPosts = response.data.content;
      const postsWithUser = newPosts.map((post) => {
        const user = group.members.find((member) => member.userId === post.userId);
        return {
          ...post,
          user: user,
        };
      });
      setPosts((prev) => (page === 0 ? postsWithUser : [...prev, ...postsWithUser]));
      setHasNext(!response.data.last);
    }).catch((error) => {
      console.error('게시글을 불러오는데 실패했습니다.' + error);
    });
  }

  const handleNextPage = () => {
    fetchBoards(page + 1);
    setPage((prev) => prev + 1);
  }

  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">게시글 {posts?.length ?? 0}</h3>
          { isMember && <Button title='글쓰기' onClick={() => navigate('write')}  /> }
        </div>
        <BoardContainer>
            <RoundFilter title="전체" variant={selectedBoard === 'all' ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard('all')} />
          { group.boards?.map((board) => (
            <RoundFilter key={board} title={board} variant={selectedBoard === board ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard(board)} />
          ))}
          </BoardContainer>

        <FlexContainer>
          {
            posts?.map((post) => (
              <PostListItem key={post.id} post={post} onClick={() => navigate(`${post.id}`)} />
            ))
          }
        </FlexContainer>


        {hasNext && <Button title={'더 보기'} onClick={handleNextPage}></Button> }
      </InnerContainer>

    </Container>

  );
}