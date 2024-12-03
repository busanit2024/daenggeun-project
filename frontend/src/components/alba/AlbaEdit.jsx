import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AlbaStyled.css";
import InputText from "../ui/InputText";
import Button from "../ui/Button";

const AlbaEdit = () => {
  const { id } = useParams(); // URL에서 ID 추출
  const navigate = useNavigate(); // 페이지 이동 hook
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    wage: "",
    workDays: [],
    startTime: "",
    endTime: "",
  });

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/alba/${id}`); // GET 요청으로 기존 데이터 조회
        setForm(response.data); // 응답 데이터를 상태에 설정
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchJob();
  }, [id]);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 수정 데이터 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/alba/${id}`, form); // PUT 요청으로 데이터 수정
      alert("수정이 완료되었습니다.");
      navigate(`/alba/${id}`); // 상세 페이지로 이동
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">알바 수정</h1>
      <form className="form" onSubmit={handleSubmit}>
        <InputText
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          className="textarea"
          name="description"
          placeholder="상세 내용"
          value={form.description}
          onChange={handleChange}
        ></textarea>
        <InputText
          name="location"
          placeholder="위치"
          value={form.location}
          onChange={handleChange}
        />
        <InputText
          name="wage"
          placeholder="시급"
          value={form.wage}
          onChange={handleChange}
        />
        <div className="work-time">
          <h3 className="section-title">근무 시간</h3>
          <InputText
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
          ~
          <InputText
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" title="수정 완료" variant="primary" />
      </form>
    </div>
  );
};

export default AlbaEdit;
