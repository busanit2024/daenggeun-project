import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/AlbaEdit.css";
import axios from "axios";

const AlbaEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    wage: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/alba/${id}`);
        setForm(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/alba/${id}`, form);
      navigate(`/alba/${id}`);
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">알바 수정</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
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
        <input
          className="input"
          name="location"
          placeholder="위치"
          value={form.location}
          onChange={handleChange}
        />
        <input
          className="input"
          name="wage"
          placeholder="시급"
          value={form.wage}
          onChange={handleChange}
        />
        <button className="button" type="submit">
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default AlbaEdit;
