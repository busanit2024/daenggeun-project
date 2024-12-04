import { useOutletContext } from "react-router-dom";
import MemberListItem from "./MemberListItem";
import { Container, GridContainer, InnerContainer } from "./GroupPageLayout";
import Button from "../ui/Button";

export default function GroupMembers() {
  const { group } = useOutletContext();

  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">멤버</h3>
        </div>
        <GridContainer>
          <MemberListItem />
          <MemberListItem />
          <MemberListItem />
          <MemberListItem />
        </GridContainer>
        <Button title={'더 보기'}></Button>
      </InnerContainer>
    </Container>
  );
}