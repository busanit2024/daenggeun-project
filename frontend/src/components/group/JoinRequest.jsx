import { useOutletContext } from "react-router-dom";
import Button from "../ui/Button";
import { Container, FlexContainer, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { calculateDate } from "../../utils/calculateDate";

const RequestItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .profile {
    display: flex;
    gap: 16px;
    align-items: center;
    width: 100%;

    .profile-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .profile-container {
      display: flex;
      gap: 4px;
      .name {
        font-size: 16px;
        font-weight: bold;
      }

      .nickname {
        color: #666666;
      }

      .location {
        color: #666666;
      }

      .date {
        color: #666666;
      }
    }

  }

  .buttons {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
`;

export default function JoinRequest() {
  const { group } = useOutletContext();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (group.requests) {
      const userIds = group.requests.map((request) => request.userId);
      axios.post(`/api/group/members`, userIds).then((response) => {
        const newRequests = group.requests.map((request) => {
          const user = response.data.find((user) => user.uid === request.userId);
          return {
            ...request,
            location: user.location,
            username: user.username,
            profileImage: user.profileImage,
          };
        });
        newRequests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
        setRequests(newRequests);
      }).catch((error) => {
        console.error("멤버 정보를 불러오는데 실패했습니다." + error);
      });
    }
  }, [group]);

  const handleAccept = (request) => {
    axios.post(`/api/group/join/request/accept`, request).then((response) => {
      alert("가입 신청을 승인했습니다.");
      window.location.reload();
    }).catch((error) => {
      alert("가입 신청 승인에 실패했습니다.");
      console.error("가입 신청 승인에 실패했습니다." + error);
    });
  }

  const handleReject = (request) => {
    if (window.confirm("가입 신청을 거절할까요?")) {
      axios.post(`/api/group/join/request/reject`, request).then((response) => {
        alert("가입 신청을 거절했습니다.");
        window.location.reload();
      }).catch((error) => {
        alert("가입 신청 거절에 실패했습니다.");
        console.error("가입 신청 거절에 실패했습니다." + error);
      });
    } else return;
  }

  const getPendingRequests = () => {
    if (group.requests) {
      const pendingRequests = group.requests.filter((request) => request.status === 'PENDING');
      return pendingRequests.length;
    }
    return 0;
  };

  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">가입 신청 {getPendingRequests()}</h3>
        </div>

        <FlexContainer>
          {requests?.map((request) => (
            <RequestItem key={request.userId + request.requestDate}>
              <div className="profile">
                <div className="profile-image">
                  <img src={request.profileImage?.url ?? '/images/defaultProfileImage.png'} alt="프로필 이미지" />
                </div>
                <div className="info">
                  <div className="profile-container">
                    <span className="name">{request.username ?? '이름'}</span>
                    {request.groupNickName && <span className="nickname">({request.groupNickName})</span>}
                    <span className="location">{request.location?.[0]?.emd ?? '지역'}</span>
                    <span> · </span>
                    <span className="date">{calculateDate(request.requestDate)} 전</span>
                  </div>
                  <div className="message">
                    {request.message ?? '가입 신청 메시지'}
                  </div>
                </div>
              </div>
              <div className="buttons">
                {request.status === 'PENDING' && (
                  <>
                    <Button title={'승인'} variant="primary" onClick={() => handleAccept(request)}></Button>
                    <Button title={'거절'} onClick={() => handleReject(request)}></Button>
                  </>
                )}
                {request.status === 'APPROVED' && (
                  <Button title={'승인됨'} disabled></Button>
                )}
                {request.status === 'REJECTED' && (
                  <Button title={'거절됨'} disabled></Button>
                )}
              </div>
            </RequestItem>
          ))}
        </FlexContainer>


        <Button title={'더 보기'}></Button>
      </InnerContainer>

    </Container>
  );
}