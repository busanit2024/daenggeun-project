import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupPageLayout from "../../group/GroupPageLayout";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & .innerContainer:not(:last-child) {
    border-bottom: 1px solid #dcdcdc;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 24px;

  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .title {
    margin: 0;
  }

  .more {
    display: flex;
    gap: 4px;
    align-items: center;
    color: #666666;
    cursor: pointer;
  }
`;

export default function GroupViewPage(props) {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState({});

  useEffect(() => {
    axios.get("/api/group/view/" + groupId).then((response) => {
      setGroup(response.data);
      console.log(response.data);
    })
      .catch((error) => {
        console.error("모임 정보를 불러오는데 실패했습니다." + error);
      });
  }, []);


  return (
    <GroupPageLayout group={group}>
      <Container>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">앨범</h3>
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
          </div>
        </InnerContainer>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">멤버 {group.members?.length ?? 0}</h3>
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
          </div>
        </InnerContainer>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">일정 {group.schedules?.length ?? 0}</h3>
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
          </div>
        </InnerContainer>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">게시글 {group.posts?.length ?? 0}</h3>
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
          </div>
        </InnerContainer>
      </Container>
    </GroupPageLayout>
  );

}