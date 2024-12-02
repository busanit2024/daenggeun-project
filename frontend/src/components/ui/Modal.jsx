import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  width: 600px;
  background-color: white;
  border-radius: 24px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #dcdcdc;
`;

const Title = styled.h2`
  margin: 0;
`;

const CloseButton = styled.div`
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
  min-height: 200px;
  gap: 24px;
`;

export default function Modal(props) {
    const { title, children, onClose, isOpen } = props;
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContainer>
                <Header>
                    <Title>{title}</Title>
                    <CloseButton onClick={onClose}>
                      <img width={20} src="/images/icon/cancel_black.svg" alt="닫기" />
                    </CloseButton>
                </Header>
                <Content>
                    {children}
                </Content>
            </ModalContainer>
        </ModalOverlay>
    );
}