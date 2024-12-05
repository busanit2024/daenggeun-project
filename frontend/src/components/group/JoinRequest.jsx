import { useOutletContext } from "react-router-dom";
import Button from "../ui/Button";
import { Container, FlexContainer, InnerContainer } from "./GroupPageLayout";

export default function JoinRequest () {
  const { group } = useOutletContext();
  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">가입 신청 {group.requests?.length ?? 0}</h3>
        </div>

        <FlexContainer>
        </FlexContainer>


        <Button title={'더 보기'}></Button>
      </InnerContainer>

    </Container>
  );
}