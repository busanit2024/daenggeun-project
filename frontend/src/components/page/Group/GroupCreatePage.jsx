import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const categoryData = [
  "운동", "자기계발", "동네친구", "아웃도어"
]

const rangeData = [
  { label: "가까운 동네", name: 0 },
  { label: "조금 먼 동네", name: 1 },
  { label: "먼 동네" , name: 2 },
  { label: "지역 제한 없음", name: 3 },
]

const ageData = [
  "누구나", "20대", "30대", "40대", "50대", "60대",
]

const maxMemberData = [
  0, 10, 20, 30, 50, 100,
]

export default function GroupCreatePage(props) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [range, setRange] = useState(0);
  const [requireApproval, setRequireApproval] = useState(false);
  const [age, setAge] = useState("");
  const [maxMember, setMaxMember] = useState(0);
  const [requireIdCheck, setRequireIdCheck] = useState(false);
  const [useNickname, setUseNickname] = useState(false);

  const createGroup = () => {
    axios.post("/api/group/save", {
      title: title,
      description: description,
      groupRange: range,
      category: category,
      requireIdCheck: requireIdCheck,
      requireApproval: requireApproval,
      ageRange: age,
      maxMember: maxMember,
      useNickname: useNickname,
    }).then(() => {
      alert("모임이 생성되었습니다.");
      navigate("/group");
    }).catch((error) => {
      alert("모임 생성에 실패했습니다.");
      console.error(error);
    });
  }




  const firstStep = (
    <Container>
      <h2>어떤 모임을 만들까요?</h2>
      <h4>모임명</h4>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

      <h4>카테고리</h4>
      {categoryData.map((item) => (
        <label>
          {item}
          <input type="radio" name="category" value={item} onChange={(e) => setCategory(e.target.value)} />
        </label>
      ))}

      <h4>모임 소개</h4>
      <textarea onChange={(e) => setDescription(e.target.value)}></textarea>

      <button onClick={() => setStep(2)}>다음</button>
    </Container>
  );

  const secondStep = (
    <Container>
      <h2>이웃들을 모집할 동네를 설정해주세요</h2>
      {rangeData.map((item) => (
        <label>
          {item.label}
          <input type="radio" name="range" value={item.name} onChange={(e) => setRange(e.target.value)} />
        </label>
      ))}

      <h2>가입은 어떻게 받을까요?</h2>
      <label>
          바로 가입
          <input type="radio" name="requireApproval" value={false} onChange={(e) => setRequireApproval(e.target.value)} />
        </label>
        <label>
          승인 후 가입
          <input type="radio" name="requireApproval" value={true} onChange={(e) => setRequireApproval(e.target.value)} />
        </label>

      <h2>어떤 이웃과 함께하고 싶나요?</h2>
      <p>연령대</p>
      {ageData.map((item) => (
        <label>
          {item}
          <input type="radio" name="age" value={item} onChange={(e) => setAge(e.target.value)} />
        </label>
      ))}

      <p>최대 인원</p>
      {maxMemberData.map((item) => (
        <label>
          {item === 0 ? "제한없음" : item}
          <input type="radio" name="maxMember" value={item} onChange={(e) => setMaxMember(e.target.value)} />
        </label>
      ))}

      <h2>본인인증이 필요한 모임인가요?</h2>
      <p>본인인증을 완료한 이웃만 모임에 가입할 수 있어요.</p>
      <label>
        본인인증 사용
        <input type="checkbox" value={requireIdCheck} onChange={(e) => setRequireIdCheck(e.target.checked)} />
      </label>

      <h2>별명을 사용할까요?</h2>
      <p>별명은 이 모임에서만 닉네임 옆에 함께 표시돼요.</p>
      <label>
        별명 사용
        <input type="checkbox" value={useNickname} onChange={(e) => setUseNickname(e.target.checked)} />
      </label>

      <button onClick={() => setStep(1)}>이전</button>
      <button onClick={() => setStep(3)}>다음</button>
    </Container>
  );

  const thirdStep = (
    <Container>
      <h2>대표사진을 등록해주세요</h2>
      <p>전체 모임 목록에서 보이는 대표 이미지에요.</p>
      <input type="file" />

      <button onClick={() => setStep(2)}>이전</button>
      <button onClick={createGroup}>모임 만들기</button>
    </Container>
  );

  return (
    <div>
      <h1>모임 만들기</h1>
      {step === 1 && firstStep}
      {step === 2 && secondStep}
      {step === 3 && thirdStep}
    </div>
  );
}