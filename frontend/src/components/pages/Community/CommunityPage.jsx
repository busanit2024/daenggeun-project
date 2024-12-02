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
    axios.get(`/api/data/filter?name=groupCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
    .catch((error) => {
      console.error("카테고리를 불러오는데 실패했습니다." + error);
    });

    axios.get("/api/community").then((response) => { // {{ edit_2 }} API 호출
      setCommunityList(response.data); // 커뮤니티 리스트 설정
    })
    .catch((error) => {
      console.error("동네생활 리스트를 불러오는데 실패했습니다." + error);
    });
  }, []);

  return(
    <Container>
        <HeadContainer>
        <h2>{`${location.si} ${location.gu} ${location.dong} ${category === 'all' ? "" : category} 동네생활`}</h2>
        <Button title="+ 글쓰기" width onClick={() => navigate("/community/write")} />
        </HeadContainer>
        <InnerContainer>
            <FilterBar>
                <div className="filterBarHeader">
                    <h3 className="title">필터</h3>
                    <div className="reset">초기화</div>
                </div>
                <div className="filterItem">
                    <h4 className="title">카테고리</h4>
                    <div className="filterList">
                        <div>
                            <input type="radio" id="all" defaultChecked name="catetgory" value="all" onChange={(e) => setCategory(e.target.value)} />
                            <label htmlFor="all">전체</label>
                        </div>
                        {categoryData.map((item) => (
                            <div key={item.name}>
                            <input type="radio" id={item.name} name="catetgory" value={item.name} onChange={(e) => setCategory(e.target.value)} />
                            <label htmlFor={item.name}>{item.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="filterItem">
                    <h4 className="title">정렬</h4>
                </div>
            </FilterBar>
            <ListContainer>
              { (category !== 'all' || sort !== "") &&
                <FilterContainer>
                  {category !== 'all' && <RoundFilter title={category} variant='search' cancelIcon onClick={() => setCategory('all')} />}
                  {sort !== "" && <RoundFilter title={sort === 'recent' ? '최신순' : '이름순'} variant='search' cancelIcon onClick={() => setSort("")} />}
                </FilterContainer>
              }
            {communityList.length === 0 && <NoSearchResult>
              <h3>{`${location.dong ? location.dong : location.gu} 작성된 글이 없어요.`}</h3>
              <p>다른 조건으로 검색하거나 글을 써보세요.</p>
              </NoSearchResult>}
            {communityList?.map((community) => (
              <CommunityListItem key={community.id} community={community} />
            ))}
            <Button title="더보기" />
            </ListContainer>
        </InnerContainer>
    </Container>
  );
}