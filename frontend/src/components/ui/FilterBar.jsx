import styled from "styled-components";

const StyledFilterBar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 240px;
  margin-right: 24px;

  & .filterBarHeader {
  display: flex;
  justify-content: space-between;
  align-items: end;
  }
  
  & .title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }

  & .reset {
    color: #666666;
    cursor: pointer;
    text-decoration: underline;
  }

  & .filterItem {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: start;
    padding: 24px 0;
  }

  & .filterItem:not(:last-child) {
    border-bottom: 1px solid #cccccc;
  }

  & .filterItem .title {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 8px;
  }

  & .filterItem .filterList {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  & .filterItem .radioWrap {
    display: flex;
    gap: 8px;
    align-items: center;
  }

`;

export default function FilterBar(props) {
  return (
    <StyledFilterBar>
      {props.children}
    </StyledFilterBar>
  );
}