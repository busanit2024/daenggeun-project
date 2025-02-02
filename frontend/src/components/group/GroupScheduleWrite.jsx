import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Container, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import Switch from "../ui/Switch";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import axios from "axios";
import { deleteFile, deleteFiles, multipleFileUpload } from "../../firebase";
import InputText from "../ui/InputText";
import { FaRegCalendar, FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Autocomplete, GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const WriteHeader = styled.div`
margin-top: 16px;
padding-bottom: 16px;
border-bottom: 1px solid #e0e0e0;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .profile {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .profile-image {
    width: 48px;
    height: 48px;
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

const TitleInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 24px;
  font-weight: bold;
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 8px;
  width: 100%;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .address {
    width: 100%;
    display: flex;
  align-items: center;
  justify-content: space-between;
  }


  .addressSearch {
    display: flex;
    width: 60%;
    gap: 8px;
    align-items: center;

    div {
      width: 100%;
    }

    input {
      width: 100%;
    }
  }

  .detail-map {
    width: 100%;
    display: flex;
    flex-direction: column;

    .location {
      padding: 24px;
    }

    .map-frame {
      width: 100%;
      height: 200px;
      border: none;
    }
  }
`;

const DateInput = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  font-family: inherit;
`;

const NumberInput = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  font-family: inherit;
  width: 60px;
  text-align: right;
`;

const CustomTextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 8px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 16px;
  resize: none;
  border-bottom: 1px solid #e0e0e0;
`;

const ImageUpload = styled.div` 
  padding: 8px 0;
  display: flex;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
`;

const CustomFileUpload = styled.input`
  display: none; 

  & + label {
    width: 100px;
    height: 100px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const ImagePreview = styled.div`

  position: relative;

  & .imageWrap {
    display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;

  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & .delete {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: black;
    color: white;
    padding: 4px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const library = ['places'];

export default function GroupScheduleWrite() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { group, membersLoaded } = useOutletContext();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: library,
  });
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteImages, setDeleteImages] = useState([]);
  const autocompleteRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [input, setInput] = useState({
    groupId: group.id,
    userId: '',
    title: '',
    content: '',
    images: [],
    date: '',
    isClosed: false,
    location: '',
    maxMember: 4,
  });

  useEffect(() => {
    if (isLoaded && input.location) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: input.location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error('장소를 찾을 수 없습니다.' + status);
        }
      });
    }
  }, [isLoaded, input.location]);

  useEffect(() => {
    setIsEditing(currentPath.includes('edit'));
  }, [currentPath]);

  useEffect(() => {
    if (isEditing) {
      axios.get(`/api/group/schedule/view/${postId}`, {params: {
        view: false,
      }}).then((response) => {
        const post = response.data;
        setInput((prev) => ({
          ...prev,
          ...post,
          id: postId,
        }));
        setImages(post.images);
      }).catch((error) => {
        console.error('게시글을 불러오는데 실패했습니다.' + error);
      });
    }
  }, [isEditing]);

  useEffect(() => {
    setInput((prev) => ({ ...prev, groupId: group.id, board: group.boards?.[0] }));
  }, [group]);

  useEffect(() => {
    const uid = sessionStorage.getItem('uid');
    if (!uid) {
      console.log('로그인이 필요합니다.');
      return;
    }
    setInput({
      ...input,
      userId: uid,
    });
    if (membersLoaded) {
      const currentMember = group.members?.find((member) => member.userId === uid);
      setMember(currentMember);
      setLoading(false);
    }
  }, [membersLoaded]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setImages((prev) => [...prev, ...fileArray]);
  }

  const handleDeleteImage = (image, index) => {
    if (image.filename) {
      setDeleteImages((prev) => [...prev, image.filename]);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const getImageUrl = (image) => {
    if (image.url) {
      return image.url;
    }
    return URL.createObjectURL(image);
  }

  const handleUpload = async () => {
    try {
      let participants = [];
      if (isEditing) {
        participants = input?.participants ?? [];
      } else {
        participants = [member.userId];
      }
      await deleteFiles(deleteImages);
      multipleFileUpload(images).then((images) => {
        setInput((prev) => ({ ...prev, images }));
        axios.post('/api/group/schedule/save', {
          ...input,
          participants,
          images,
        }).then((response) => {
          alert(`일정을 ${isEditing ? '수정했어요.' : '만들었어요.'}`);
          navigate('/group/' + group.id + '/schedule');
        }).catch((error) => {
          console.error('서버 저장에 실패했습니다.' + error);
          deleteFiles(images.map((image) => image.filename));
        });
      }).catch((error) => {
        console.error('이미지 업로드에 실패했습니다.' + error);
      });
    } catch (error) {
      console.error('일정 만들기에 실패했습니다.' + error);
      alert(`${isEditing ? '일정 수정' : '일정 만들기'}에 실패했습니다. 다시 시도해주세요.`);
    }
  };


const handlePlaceChanged = () => {
  const place = autocompleteRef.current?.getPlace();
  if (place && place.geometry) {
    const location = place.geometry.location;
    setInput((prev) => ({ ...prev, location: place.formatted_address }));
    setMarkerPosition({ lat: location.lat(), lng: location.lng() });
  }
  
};

const onLoad = (autocomplete) => {
  autocompleteRef.current = autocomplete;
}



  return (
    <Container>
      <InnerContainer>
        <div>
          <h3 className="title">{isEditing ? '일정 수정하기' : '일정 만들기'}</h3>
          <p>{group.title}</p>

          {loading && <div>사용자 정보 로딩중...</div>}

          {!loading && (
            <WriteHeader>
              <div className="profile">
                <div className="profile-image">
                  <img src={member?.profileImage?.url ?? '/images/default/defaultProfileImage.png'} onError={(e) => e.target.src = '/images/default/defaultProfileImage.png'} alt="프로필 이미지" />
                </div>

                <TitleInput underline value={input.title} onChange={(e) => setInput((prev) => ({ ...prev, title: e.target.value }))} placeholder="멤버들과 어떤 활동을 할까요?" />
              </div>
            </WriteHeader>
          )}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', marginTop: '-24px'}}>
          <OptionContainer>
            <span>
              <FaRegCalendar />
              날짜 및 시간
            </span>
            <DateInput type="datetime-local" value={input.date} onChange={(e) => setInput((prev) => ({ ...prev, date: e.target.value }))} />
          </OptionContainer>

          <OptionContainer style={{flexDirection: 'column',}}>
            <div className="address">
              <span>
              <FaLocationDot />
              장소</span>
            <div className="addressSearch">
              {isLoaded && <Autocomplete
                apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                onPlaceChanged={handlePlaceChanged}
                onLoad={onLoad}
              >
                <InputText value={input.location} onChange={(e) => setInput((prev) => ({ ...prev, location: e.target.value }))} placeholder="장소를 입력해주세요." />
              </Autocomplete> }

              
            </div>
            </div>
            <div className="detail-map">
            {isLoaded &&
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '260px' }}
            center={markerPosition || { lat: 0, lng: 0 }}
            zoom={15}
              >
                {markerPosition && <Marker position={markerPosition} />}
              </GoogleMap> }
              <div className="location">{autocompleteRef.current?.getPlace()?.name}</div>
            </div>
            
          </OptionContainer>

          

          <OptionContainer>
            <span>
              <FaUsers />
              인원
            </span>
            <div>
              <NumberInput type="number" value={input.maxMember} onChange={(e) => setInput((prev) => ({ ...prev, maxMember: e.target.value }))} />
              명
            </div>
          </OptionContainer>
        </div>

        <CustomTextArea value={input.content} onChange={(e) => setInput((prev) => ({ ...prev, content: e.target.value }))} placeholder="활동에 대한 설명을 추가해주세요." />

        <ImageUpload>
          <CustomFileUpload type="file" id="image" multiple onChange={handleImageUpload} />
          <label htmlFor="image">
            <img src="/images/icon/camera.svg" alt="이미지 업로드" />
          </label>

          {images.map((image, index) => (
            <ImagePreview key={index}>
              <div className="imageWrap">
                <img src={getImageUrl(image)} alt="이미지 미리보기" />
              </div>
              <div className="delete" onClick={() => handleDeleteImage(image, index)}>

                <img src="/images/icon/cancel.svg" alt="삭제" />
              </div>
            </ImagePreview>
          ))}


        </ImageUpload>

        <Button title={`${isEditing ? '수정하기' : '완료'}`} variant='primary' onClick={handleUpload}></Button>

      </InnerContainer>

    </Container >
  );
}