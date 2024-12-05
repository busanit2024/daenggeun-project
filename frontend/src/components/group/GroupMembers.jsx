import { useOutletContext } from "react-router-dom";
import MemberListItem from "./MemberListItem";
import { Container, GridContainer, InnerContainer } from "./GroupPageLayout";
import Button from "../ui/Button";
import styled from "styled-components";

export default function GroupMembers() {
  const { group } = useOutletContext();

  return (
    <Container>

      <InnerContainer>
        <div className="group-header">
          <h3 className="title">멤버 {group?.members?.length ?? 0}</h3>
        </div>
        <GridContainer>
          {group?.members?.map((member) => (
            <MemberListItem key={member.id} member={member} />
          ))}
        </GridContainer>
        <Button title={'더 보기'}></Button>
      </InnerContainer>
    </Container>
  );
}