import { useNavigate, useOutletContext } from "react-router-dom";
import Button from "../ui/Button";
import { Container, FlexContainer, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import ScheduleListItem from "./ScheduleListItem";
import { useEffect, useState } from "react";
import axios from "axios";

const ScheduleType = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: 500;

`;

export default function GroupSchedules() {
  const { group, membersLoaded } = useOutletContext();
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();
  const [openSchedules, setOpenSchedules] = useState([]);
  const [closedSchedules, setClosedSchedules] = useState([]);
  const [page, setPage] = useState({
    open: 0,
    closed: 0,
  });
  const [hasNext, setHasNext] = useState({
    open: true,
    closed: true,
  });

  useEffect(() => {
    const userId = sessionStorage.getItem('uid');
    if (!membersLoaded) return;
    const member = group.members?.find((member) => member.userId === userId);
    if (member) {
      setIsMember(true);
    }
  } , [group, membersLoaded]);

  useEffect(() => {
    fetchOpenSchedules(0);
    fetchClosedSchedules(0);
  }, [isMember]);

  const fetchOpenSchedules = (page) => {
    axios.get(`/api/group/schedule/${group.id}`, {params: {
      closed: false,
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
      setOpenSchedules((prev) => (page === 0 ? postsWithUser : [...prev, ...postsWithUser]));
      setHasNext((prev) => ({...prev, open: !response.data.last}));
    }).catch((error) => {
      console.error('모집중인 일정을 불러오는데 실패했습니다.' + error);
    });
  }

  const fetchClosedSchedules = (page) => {
    axios.get(`/api/group/schedule/${group.id}`, {params: {
      closed: true,
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
      setClosedSchedules((prev) => (page === 0 ? postsWithUser : [...prev, ...postsWithUser]));
      setHasNext((prev) => ({...prev, closed: !response.data.last}));
    }).catch((error) => {
      console.error('종료된 일정을 불러오는데 실패했습니다.' + error);
    });
  }


  const handleNextPageOpen = () => {
    fetchOpenSchedules(page.open + 1);
    setPage((prev) => ({...prev, open: prev.open + 1}));
  }

  const handleNextPageClosed = () => {
    fetchClosedSchedules(page.closed + 1);
    setPage((prev) => ({...prev, closed: prev.closed + 1}));
  }





  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">일정 {group.schedules?.length ?? 0}</h3>
          {isMember && <Button title='일정 만들기' onClick={() => navigate('write')} /> }
        </div>

        <ScheduleType>다가오는 일정</ScheduleType>
        <FlexContainer>
          {openSchedules.map((schedule) => (
            <ScheduleListItem key={schedule.id} schedule={schedule} onClick={() => navigate(`${schedule.id}`)} />
          ))}
          {hasNext.open && <Button title={'더 보기'} onClick={handleNextPageOpen}></Button>}
        </FlexContainer>

        <ScheduleType>종료된 일정</ScheduleType>
        <FlexContainer>
          {closedSchedules.map((schedule) => (
            <ScheduleListItem key={schedule.id} schedule={schedule} onClick={() => navigate(`${schedule.id}`)} />
          ))}
          {hasNext.closed && <Button title={'더 보기'} onClick={handleNextPageClosed}></Button>}
        </FlexContainer>

      </InnerContainer>

    </Container>
  );
}