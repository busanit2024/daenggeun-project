import { useOutletContext } from "react-router-dom";
import Button from "../ui/Button";
import { Container, FlexContainer, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import ScheduleListItem from "./ScheduleListItem";

const ScheduleType = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: 500;

`;

export default function GroupSchedules() {
  const { group } = useOutletContext();

  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">일정 {group.schedules?.length ?? 0}</h3>
          <Button title='일정 만들기' />
        </div>

        <ScheduleType>다가오는 일정</ScheduleType>
        <FlexContainer>
          <ScheduleListItem />
          <ScheduleListItem />
        </FlexContainer>

        <ScheduleType>종료된 일정</ScheduleType>
        <FlexContainer>
          <ScheduleListItem />
          <ScheduleListItem />
        </FlexContainer>



        <Button title={'더 보기'}></Button>
      </InnerContainer>

    </Container>
  );
}