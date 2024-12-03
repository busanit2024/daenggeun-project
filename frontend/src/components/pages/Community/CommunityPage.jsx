import axios from "axios";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoundFilter from "../../ui/RoundFilter";
import CommunityListItem from "./CommunityListItem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 0px;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  padding: 0 16px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const NoSearchResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 88px 0;
  & h3 {
    margin: 0;
  }

  & p {
    margin: 0;
    color: #666666;
  }
`;

export default function CommunityPage(props) {
  const navigate = useNavigate();
  const [communityList, setCommunityList] = useState([]); // 상태 변수 정의
  const [location, setLocation] = useState({"si": "부산광역시", "gu": "해운대구", "dong" : ""});
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState(""); // sort 상태 변수 추가

  useEffect(() => {
    axios.get(`/api/data/filter?name=communityCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
      .catch((error) => {
        console.error("카테고리를 불러오는데 실패했습니다." + error);
      });
  }, []);
  
// {{ edit_2 }}
useEffect(() => { // useEffect 괄호 수정
    axios.get("/api/community").then((response) => { // API 호출
      setCommunityList(response.data); // 커뮤니티 리스트 설정
    })
    .catch((error) => {
      console.error("동네생활 리스트를 불러오는데 실패했습니다." + error);
    });
  }, []);

  return(
    <Container>
        <HeadContainer>
        <h2>{`${location.si} ${location.gu} ${category === 'all' ? `${location.dong ? location.dong : ''} 동네생활` : category === '전체' ? '동네생활' : `${category}`} `}</h2>
        <Button title="+ 글쓰기" width onClick={() => navigate("/community/write")} />
        </HeadContainer>
        <InnerContainer>
        <FilterBar>
              <div className="filterItem">                    
                  <div className="filterList">
                      {categoryData.map((item, index) => ( // 라디오 버튼 제거 및 이미지 조건 추가
                        <div key={item.name} onClick={() => setCategory(item.name)} style={{ cursor: 'pointer', fontWeight: item.name === category ? 'bold' : 'normal', margin: '8px 0' }}> {/* 카테고리 간의 간격 추가 */}
                          {index === 0 ? ( // 첫 번째 카테고리만 이미지 추가
                            <>
                              <img src="/images/favorite.png" alt={item.name} style={{ width: '20px', height: '20px', marginTop: '-4px', verticalAlign: 'middle' }}/> {/* 카테고리 이미지 추가 */}
                              {item.name}
                            </>
                          ) : (
                            item.name
                          )}
                        </div>
                      ))}
                  </div>
              </div>
            </FilterBar>
            <ListContainer>
            {communityList.length === 0 && <NoSearchResult>
              <h3>{`${location.dong ? location.dong : location.gu} 작성된 글이 없어요.`}</h3>
              <p>다른 조건으로 검색하거나 글을 써보세요.</p>
              </NoSearchResult>}
            {communityList?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((community) => ( // 최신순 정렬
              <CommunityListItem key={community.id} community={community} />
            ))}
            <Button title="더보기" />
            </ListContainer>
        </InnerContainer>
    </Container>
  );
}