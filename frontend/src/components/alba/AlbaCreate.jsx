import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AlbaCreate.css";
import axios from "axios";

const AlbaCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    wage: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/alba", form);
      navigate("/");
    } catch (error) {
      console.error("글 작성 중 오류 발생:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">알바 글 작성</h1>
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
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default AlbaCreate;
