import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import Breadcrumb from "../../ui/Breadcrumb";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import { elapsedText } from "../../../utils/elapsedText";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { deleteFiles } from "../../../firebase";
import CommentWrite from "../../community/CommentWrite";
import CommentListItem from "../../community/CommentListItem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  gap: 16px;
  width: 640px;
  margin: 24px auto;
`;

const TextContainer = styled.div`
  flex: 1;
  margin-top: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-style: normal;
  margin: 0;
  margin-top: 10px;
`;

const Content = styled.p`
  font-size: 15px;
  margin: 0;
  margin-top: 10px;

  display: -webkit-box;
  // -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
`;

const TagContainer = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666666;

  & span {
    display: flex;
    align-items: center;
    gap: 2px;
  }
`;

const ImageContainer = styled.div`
  margin-top: 15px;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ProfileImage = styled.div`
  width: 48px;
  height: 48px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #dcdcdc;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name-wrap {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .name {
    font-size: 16px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .nickname {
    color: #666666;
  }

  .location {
    color: #666666;
  }

  .desc {
    color: #666666;
  }

`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 24px;

  .loading {
    width: 100%;
    border-top: 1px solid #ccc;
    padding: 36px;
  }

  .no-comment {
    width: 100%;
    padding: 36px;
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border-top: 1px solid #ccc;
  }
`;


const libraries = ['places'];

export default function CommunityViewPage(props) {
  const currentUserId = sessionStorage.getItem('uid');
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState({ sido: "부산광역시", sigungu: "", emd: "", category: "all", sort: "" });
  const [categoryData, setCategoryData] = useState([]);
  const [member, setMember] = useState(null);
  const [busanJuso, setBusanJuso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const { communityId } = useParams();
  const [community, setCommunity] = useState({});
  const [comments, setComments] = useState([]);
  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);

  const handleDelete = async () => {
    try {
      if (community.images && community.images.length > 0) {
        await deleteFiles(community.images.map(image => ({ filename: image.filename })));
      }
      await axios.delete(`/api/community/delete/${community.id}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/community");
    } catch (error) {
      console.error("게시글 삭제 실패", error);
    }
  }
  

  useEffect(() => {
    if (!communityId) return;
      fetchPost();
  }, [communityId]);
  
  useEffect(() => {
      axios.get(`/api/data/filter?name=communityCategory`).then((response) => {
        setCategoryData(response.data.filters);
      })
        .catch((error) => {
          console.error("카테고리를 불러오는데 실패했습니다." + error);
        });
  
      axios.get(`/api/data/filter?name=busanJuso`).then((response) => {
        setBusanJuso(response.data.locationFilters);
      }).catch((error) => {
        console.error("부산 주소를 불러오는데 실패했습니다." + error);
      });
    }, []);
  
  useEffect(() => {
    setSearchFilter({ ...searchFilter, sido: currentLocation.sido, sigungu: currentLocation.sigungu });
  }, [currentLocation]);

  const fetchPost = () => {
    axios.get(`/api/community/view/${communityId}`).then((response) => {
      setCommunity(response.data);
      console.log(response.data);
      fetchMemberInfo(response.data.userId);
      fetchComments(response.data.id);
    })
    .catch((error) => {
        console.error("동네생활 정보를 불러오는데 실패했습니다." + error);
    });
  };

  const fetchComments = (communityId) => {
    axios.get(`/api/comment/list/${communityId}`).then( async (response) => {
      const commentsData = response.data;
      const commentsWithUser = await Promise.all(commentsData.map(async (comment) => {
        const userResponse = await axios.get(`/user/${comment.userId}`);
        return { ...comment, user: userResponse.data };
      }));
      setComments(commentsWithUser);
      setCommentLoading(false);
      console.log(commentsWithUser);
    }).catch((error) => {
      console.error("댓글을 불러오는데 실패했습니다." + error);
    });
  };

  const handleSubmitComment = (comment) => {
    axios.post(`/api/comment/write`, {
      postId: community.id,
      userId: currentUserId,
      boardType: 'COMMUNITY',
      commentType: 'COMMENT',
      content: comment,
    }).then((response) => {
      alert("댓글이 작성되었습니다.");
      fetchComments(community.id);
    }).catch((error) => {
      console.error("댓글 작성에 실패했습니다." + error);
    });
  };

  const handleDeleteComment = (comment) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
    axios.post(`/api/comment/delete`, comment).then((response) => {
      alert("댓글이 삭제되었습니다.");
      fetchComments(community.id);
    }).catch((error) => {
      console.error("댓글 삭제에 실패했습니다." + error);
    });
  }
  }

  const handleEditComment = (comment) => {
    axios.post(`/api/comment/write`, comment).then((response) => {
      alert("댓글이 수정되었습니다.");
      fetchComments(community.id);
    }).catch((error) => {
      console.error("댓글 수정에 실패했습니다." + error);
    });
  }

  useEffect(() => {
    setLoading(true);
    setSearchFilter({ ...searchFilter, emd: '' });
  }, [searchFilter.sigungu, busanJuso]);

  const fetchMemberInfo = (communityUserId) => {
    console.log("userId",communityUserId)
    axios.get(`/user/find?uid=${communityUserId}`).then((response) => {
      console.log(response.data);
      setMember(response.data)
      
    })
      .catch((error) => {
        console.error("사용자 정보 불러오기에 실패했습니다." + error);
      });    
  };

  const routes = [
  { path: "/community", name: "동네생활" },
  { path: `/community/${community.id}`, name: community.category },
  ];

  return (
      <>
      <Breadcrumb routes={routes} />
      <Container>
          <InnerContainer>
              <FilterBar>
              <div className="filterItem">
                  <div className="filterList">
                  <label className="radioWrap" onClick={() => setSearchFilter({...searchFilter, category: '인기글'})} style={{ fontWeight: searchFilter.category === '인기글' ? 'bold' : 'normal' }}>
                      <img src="/images/icon/favorite.png" style={{ height: '20px', width: '20px', marginRight: '-6px' }} />
                      인기글
                  </label>
                  <label className="radioWrap" onClick={() => setSearchFilter({...searchFilter, category: 'all'})} style={{ fontWeight: searchFilter.category === 'all' ? 'bold' : 'normal' }}>
                      전체
                  </label>
                  {categoryData.map((item) => (
                      <label key={item.name} className="radioWrap" onClick={() => setSearchFilter({...searchFilter, category: item.name})} style={{ fontWeight: item.name === searchFilter.category ? 'bold' : 'normal' }}>
                      {item.name}
                      </label>
                  ))}
                  </div>
              </div>
              </FilterBar>
              <TextContainer>
                <Wrapper>
                  <ProfileImage>
                    {<img src={member?.profileImage?.url ?? '/images/default/defaultProfileImage.png'} alt={member?.name} onError={(e) => e.target.src = '/images/default/defaultProfileImage.png'}/>}
                  </ProfileImage>
                  <MemberInfo>
                    <div className="name-wrap">
                      <div className="name">{member?.username ?? ''}</div>
                    </div>
                    <TagContainer>
                      <span>
                        <img height={16} src="/images/icon/location_gray.svg" alt="location" />
                        {community.location?.emd ?? community.location?.sigungu ?? '위치 정보 없음'}
                      </span>
                      <span> · </span>
                      {elapsedText(new Date(community.createdDate))}
                    </TagContainer>
                  </MemberInfo>
                  <ButtonContainer>
                    {community.userId === currentUserId ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button title="수정하기" onClick={() => navigate(`/communityEdit/${community.id}`)} />
                        <Button title="삭제하기" onClick={() => handleDelete()} />
                      </div>
                    ) : (
                      ""
                    )}
                  </ButtonContainer>
                </Wrapper>
                <Title>{community.title}</Title>
                <Content>{community.content}</Content>
                <ImageContainer>
                  {community.images && community.images.length > 0 
                  && community.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      style={{ width: "80%", height: "80%" }}
                    />
                  ))
                }
              </ImageContainer>
              <CommentList>
                {commentLoading && <div className="loading">댓글을 불러오는 중입니다.</div>}
                {!commentLoading && comments.map((comment) => (
                  <CommentListItem key={comment.id} comment={comment} handleDelete={handleDeleteComment} handleEdit={handleEditComment} />
                ))}
                {!commentLoading && comments.length === 0 && 
                <div className="no-comment">
                  <span>아직 댓글이 없어요.</span>
                  <span>가장 먼저 댓글을 남겨보세요.</span>
                </div>}
              </CommentList>
              <CommentWrite handleSubmitComment={handleSubmitComment} />
              </TextContainer>

          </InnerContainer>
      </Container>
      </>
  );
}