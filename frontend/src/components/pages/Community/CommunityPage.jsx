import axios from "axios";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  gap: 16px;
  width: 100%;
`;

const FilterBarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  
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
`;

export default function CommunityPage(props) {
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);
  const [location, setLocation] = useState({"si": "부산광역시", "gu": "해운대구", "dong" : ""});
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    axios.get(`/api/data/filter?name=groupCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
    .catch((error) => {
      console.error("카테고리를 불러오는데 실패했습니다." + error);
    });

    axios.get("/api/group/list").then((response) => {
      setGroupList(response.data);
    })
    .catch((error) => {
      console.error("동네생활 리스트를 불러오는데 실패했습니다." + error);
    });
  }, []);

  return(
    <Container>
        <HeadContainer>
        <h2>{`${location.si} ${location.gu} ${location.dong} ${category === 'all' ? "" : category} 모임`}</h2>
        <Button title="모임 만들기" width onClick={() => navigate("/group/create")}/>
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
        </InnerContainer>
    </Container>
  )
}