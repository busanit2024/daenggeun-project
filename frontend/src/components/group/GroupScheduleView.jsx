import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Container, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import Switch from "../ui/Switch";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import axios from "axios";
import { deleteFiles, multipleFileUpload } from "../../firebase";
import { calculateDate } from "../../utils/calculateDate";
import { ButtonContainer } from "../pages/Group/GroupCreatePage";
import { FaCalendar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const ViewHeader = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .profile {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .profile-image {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .profile-name {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .options {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .switch {
    display: flex;
    gap: 4px;
    align-items: center;
  }
`;

const TitleWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  padding: 12px 8px;
  border-bottom: 1px solid #e0e0e0;

  .open {
    color: #FF7B07;
  }

  .closed {
    color: #d4b55f;
  }

  .title {
    color: #666666;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: 400px;
  padding: 8px;
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 16px;
  resize: none;
  border-bottom: 1px solid #e0e0e0;

  .detailWrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  .detail {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 16px;
  }

  .detail-map {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 24px;

    .location {
      padding: 24px;
      border-top: 1px solid #e0e0e0;
      font-size: 16px;
    }
  }
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  margin-top: 24px;

  img {
    max-width: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  font-size: 14px;
  color: #666666;
  display: flex;
  gap: 4px;
`;

const ParticipantContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px;
  padding-bottom: 24px;

  .title {
    display: flex;
    gap: 4px;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .accent {
    color: #FF7B07;
  }

  .members {
    display: flex;
    gap: 36px;
    align-items: center;
  }
  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .profile-image {
    width: 48px;
    height: 48px;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .name {
      font-size: 14px;
    }
  }
}
`;

const library = ['places'];

export default function GroupScheduleView() {
  const { group, membersLoaded } = useOutletContext();
  const naviagte = useNavigate();
  const { postId } = useParams();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: library,
  });
  const [member, setMember] = useState([]);
  const [post, setPost] = useState({});
  const [isMyPost, setIsMyPost] = useState(false);
  const [date, setDate] = useState({});
  const [markerPosition, setMarkerPosition] = useState(null);

  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour < 12 ? '오전' : '오후';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const time = `${ampm} ${formattedHour}:${minute < 10 ? '0' + minute : minute}`;
    return { year, month, day, time };
  }

  useEffect(() => {
    if (!postId || !membersLoaded) {
      return;
    }
    axios.get(`/api/group/schedule/view/${postId}`, {
      params:
        { view: true }
    }).then((response) => {
      const newPost = response.data;
      setDate(formatDate(newPost.date));
      setPost({ ...newPost, user: group.members.find((member) => member.userId === newPost.userId) });
      const userId = sessionStorage.getItem('uid');
      if (newPost.userId === userId) {
        setIsMyPost(true);
      }
      console.log(newPost);
    }).catch((error) => {
      console.error('게시글을 불러오는데 실패했습니다.' + error);
    });
  }, [postId, membersLoaded]);

  useEffect(() => {
    if (isLoaded && post.location) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: post.location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error('장소를 찾을 수 없습니다.' + status);
        }
      });
    }
  }, [isLoaded, post.location]);


  const handleDelete = () => {
    const filenames = post.images.map((image) => image.filename);

    axios.post(`/api/group/schedule/delete`, post).then((response) => {
      deleteFiles(filenames).then(() => {
        alert('게시글을 삭제했어요.');
        naviagte(`/group/${group.id}/board`);
      }).catch((error) => {
        console.error('파일을 삭제하는데 실패했습니다.' + error);
      });
    }).catch((error) => {
      console.error('게시글을 삭제하는데 실패했습니다.' + error);
    });
  };

  const checkAssign = () => {
    const userId = sessionStorage.getItem('uid');
    let isParticipant = false;
    let isFull = false;
    if (post.participants?.includes(userId)) {
      isParticipant = true;
    }
    if (post.participants?.length >= post.maxMember) {
      isFull = true;
    }

    return isParticipant || isFull;
  }

  const handleAssign = () => {
    const userId = sessionStorage.getItem('uid');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
    axios.get(`/api/group/schedule/assign`, {
      params: {
        scheduleId: post.id,
        userId: userId,
      }
    }).then((response) => {
      alert('일정에 참여했어요.');
      window.location.reload();
    }).catch((error) => {
      console.error('참여 신청에 실패했습니다.' + error);
    });

  }

  return (
    <Container>
      <InnerContainer>
        <div>
          <TitleWrap>
            <span className={post?.closed ? 'closed' : 'open'}>{post?.closed ? '종료' : '모집중'}</span>
            <span className="title">{post?.title ?? '게시글 제목'}</span>
          </TitleWrap>

          <ViewHeader>
            <div className="profile">
              <div className="profile-image">
                <img src={post?.user?.profileImage?.url ?? '/images/defaultProfileImage.png'} onError={(e) => e.target.src = '/images/defaultProfileImage.png'} alt="프로필 이미지" />
              </div>

              <div className="profile-name">
                <span>{post?.user?.username ?? '작성자'}</span>
                <span>{group.useNickname && `(${post?.user?.groupNickName ?? '별명'})`}</span>

              </div>
            </div>
            <Info>
              <span>조회 {post?.views ?? 0}</span>
              <span> · </span>
              <span>{post?.createdDate ? calculateDate(post.createdDate) + ' 전' : '작성일'}</span>
              <span> · </span>
              <span>{post?.isPrivate ? '모임에만 공개' : '전체 공개'}</span>
            </Info>
          </ViewHeader>



        </div>
        <Content>
          <div className="detailWrap">
            <div className="detail">
              <FaCalendar />
              {date.month}월 {date.day}일 {date.time}
            </div>
            <div className="detail">
              <FaLocationDot />
              {post?.location ?? '장소'}
            </div>
          </div>


          {post?.content ?? '게시글 내용'}
          {post?.images?.length > 0 && <ImageContainer>
            {post?.images?.map((image) => (
              <img key={image.filename} src={image.url} alt="게시글 이미지" />
            ))}
          </ImageContainer>
          }
          <div className="detail-map">
          {isLoaded &&
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '260px' }}
            center={markerPosition || { lat: 0, lng: 0 }}
            zoom={15}
              >
                {markerPosition && <Marker position={markerPosition} />}
              </GoogleMap> }
            <div className="location">{post?.location}</div>
          </div>

        </Content>

        <ParticipantContainer>
          <div className="title">참여 중인 이웃
            <span>
              <span className="accent">{post?.participants?.length ?? 0}</span>
              <span style={{ fontWeight: 'normal' }}>/</span>
              <span>{post?.maxMember}</span>
            </span>

          </div>
          <div className="members">
            {post?.participants?.map((participant) => {
              const member = group.members.find((member) => member.userId === participant);

              return (
                <div className="member" key={participant}>
                  <div className="profile-image">
                    <img src={member?.profileImage?.url ?? '/images/defaultProfileImage.png'} alt="프로필 이미지" onError={(e) => e.target.src = '/images/defaultProfileImage.png'} />
                  </div>
                  <div className="name">{member?.username}</div>
                </div>
              );
            }
            )}
          </div>
        </ParticipantContainer>


        {!checkAssign() && <Button title="참여하기" variant="primary" onClick={handleAssign} />}

        {isMyPost && <ButtonContainer>
          <Button title="수정" onClick={() => naviagte(`edit`)} />
          <Button title="삭제" variant="danger" onClick={handleDelete} />
        </ButtonContainer>}
      </InnerContainer>

    </Container >
  );
}