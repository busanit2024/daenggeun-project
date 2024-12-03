import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import GroupListItem from "../../group/GroupListItem";
import RoundFilter from "../../ui/RoundFilter";
import Radio from "../../ui/Radio";

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


export default function GroupPage(props) {
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);
  const [location, setLocation] = useState({ "si": "부산광역시", "gu": "해운대구", "dong": "" });
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  useEffect(() => {
    axios.get(`/api/data/filter?name=groupCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
      .catch((error) => {
        console.error("카테고리를 불러오는데 실패했습니다." + error);
      });
  }, []);

  useEffect(() => {
    axios.get(`api/group/search?gu=${location.gu}&dong=${location.dong}&category=${category}&sort=${sort}`).then((response) => {
      setGroupList(response.data);
    })
      .catch((error) => {
        console.error("모임 리스트를 불러오는데 실패했습니다." + error);
      });
  }, [location, category, sort]);

  const resetFilter = () => {
    setLocation({ "si": "부산광역시", "gu": "해운대구", "dong": "" });
    setCategory("all");
    setSort("");
  }


  return (
    <Container>
      <HeadContainer>
        <h2>{`${location.si} ${location.gu} ${location.dong} ${category === 'all' ? "" : category} 모임`}</h2>
        <Button title="모임 만들기" width onClick={() => navigate("/group/create")} />
      </HeadContainer>
      <InnerContainer>
        <FilterBar>
          <div className="filterBarHeader">
            <h3 className="title">필터</h3>
            <div className="reset" onClick={resetFilter}>초기화</div>
          </div>
          <div className="filterItem">
            <h4 className="title">카테고리</h4>
            <div className="filterList">
              <label className="radioWrap">
                <Radio name="category" value="all" checked={category === 'all'} onChange={(e) => setCategory(e.target.value)} />
                전체
              </label>
              {categoryData.map((item) => (
                <label key={item.name} className="radioWrap">
                  <Radio name="category" value={item.name} checked={item.name === category} onChange={(e) => setCategory(e.target.value)} />
                  {item.name}
                </label>
              ))}
            </div>
          </div>
          <div className="filterItem">
            <h4 className="title">정렬</h4>
            <label className="radioWrap">
              <Radio name="sort" value="recent" checked={sort === 'recent'} onChange={(e) => setSort(e.target.value)} />
              최신순
            </label>
            <label className="radioWrap">
              <Radio name="sort" value="name" checked={sort === 'name'} onChange={(e) => setSort(e.target.value)} />
              이름순
            </label>

          </div>
        </FilterBar>

        <ListContainer>
          { (category !== 'all' || sort !== "") &&
            <FilterContainer>
              {category !== 'all' && <RoundFilter title={category} variant='search' cancelIcon onClick={() => setCategory('all')} />}
              {sort !== "" && <RoundFilter title={sort === 'recent' ? '최신순' : '이름순'} variant='search' cancelIcon onClick={() => setSort("")} />}
            </FilterContainer>
          }
          {groupList.length === 0 && <NoSearchResult>
            <h3>{`${location.dong ? location.dong : location.gu} 근처에 모임이 없어요.`}</h3>
            <p>다른 조건으로 검색해주세요.</p>
            </NoSearchResult>}
          {groupList?.map((group) => (
            <GroupListItem key={group.id} group={group} />
          ))}
          <Button title="더보기" />
        </ListContainer>

      </InnerContainer>

    </Container>
  );

}