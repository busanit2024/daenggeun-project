import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ImAlarm } from "react-icons/im";
import { ImCalendar } from "react-icons/im";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LiaWonSignSolid } from "react-icons/lia";
import Breadcrumb from "../../Breadcrumb";
import "../../../styles/AlbaStyled.css";
import Button from "../../ui/Button";
import styled from "styled-components";
import AlbaMemberProfile from "../../alba/AlbaMemberProfile";


const AlbaDetail = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate(); // 상세 페이지 이동용
  const [job, setJob] = useState(null); // 상세 데이터 상태
  const [relatedJobs, setRelatedJobs] = useState([]); // 관련 알바 데이터 상태
  const [user, setUser] = useState(null); // 사용자 데이터 상태
  const [post, setPost] = useState(null);

  const Location = styled.p`
  margin: 8px 0 0;
  color: #777;
`;
  useEffect(() => {
    // 사용자 정보 로드 (로그인 상태 확인 및 사용자 역할 확인)
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/user"); // 현재 사용자 정보 요청
        setUser(response.data);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };

    // 상세 데이터 로드
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/alba/${id}`);
        console.log("fetchjob",response.data)
        setJob(response.data);
      } catch (error) {
        console.error("글 조회 중 오류 발생:", error);
      }
    };

    // 관련 알바 데이터 로드
    const fetchRelatedJobs = async () => {
      try {
        const response = await axios.get("/api/alba"); // 관련 데이터는 전체 데이터에서 가져옴
        setRelatedJobs(response.data.filter((item) => item._id !== id));
      } catch (error) {
        console.error("관련 알바 데이터 불러오기 실패:", error);
      }
    };

    fetchUser();
    fetchJob();
    fetchRelatedJobs();
  }, [id]);

  if (!job) return <p>로딩 중...</p>; // 로딩 처리

  const routes = [
    { path: "/", name: "홈" },
    { path: "/alba", name: "알바 검색" },
    { path: "/alba/create", name: "알바 게시물 작성" },
    { path: `/alba/${id}`, name: "알바 상세 보기" },
    { path: `/alba/${id}/edit`, name: "알바 게시물 수정" },
  ];

  const handleEdit = () => {
    // 수정 버튼 클릭 시 수정 페이지로 이동
    navigate(`/alba/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/alba/${id}`);
        alert("게시물이 삭제되었습니다.");
        navigate("/alba");
      } catch (error) {
        console.error("게시물 삭제 중 오류 발생:", error);
        alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const isAuthor = user && (user.id === job.authorId || user.role === "admin");

  return (
    <div className="alba-detail-page">
      <Breadcrumb routes={routes} />

      {/* 상세 영역 */}
      <div className="alba-detail-container">
        
        {/* 좌측 영역 */}
        <div className="detail-left">
          
          <img
            src={job.image != null ? job.image.url : "default-image.png"}
            alt={job.title}
            className="detail-image"
          />
          <div className="profile-info">
            {/* <h2>{job.title}</h2>
            <p>시급: {job.wage}</p> */}
          <AlbaMemberProfile userId={job.userId}/>
        
          </div>
        <Button type="edit-button" title="수정" variant="gray" onClick={handleEdit}/>
        <Button type="delete-button" title="삭제" variant="danger" onClick={handleDelete}/>
        </div>

        {/* 우측 영역 */}
      
        <div className="detail-right">
        
          <div className="detail-body">
            <h2>{job.title}</h2>
            
            <p><LiaWonSignSolid /> {job.wageType} {job.wage}</p>
            <p><HiOutlineLocationMarker /> {job.workPlace}</p>
            <p><ImCalendar /> {job.workDays}</p>
            <p><ImAlarm /> {job.workTime.start}~{job.workTime.end}</p>

            <h2>상세 내용</h2>
            <pre>{job.description}</pre>
          </div>

          {/* 수정 및 삭제 버튼 (작성자와 관리자만 볼 수 있음) */}
          {isAuthor && (
            <div className="detail-actions">
              <button className="edit-button" onClick={handleEdit}>수정하기</button>
              <button className="delete-button" onClick={handleDelete}>삭제하기</button>
            </div>
          )}

          <div className="detail-map">
            <iframe
              title="location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                job.workPlace
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="map-frame"
            ></iframe>
          </div>
          {job.workPlace}
        </div>
        
      </div>
      

      {/* 하단 관련 알바 리스트 */}
      <div className="related-jobs">
        <h2>관련 알바 리스트</h2>
        <div className="alba-list-full">
          {relatedJobs.length > 0 ? (
            relatedJobs.map((item) => (
              <div
                key={item._id}
                className="alba-item-full"
                onClick={() => navigate(`/alba/${item._id}`)}
              >
                <h4>{item.title}</h4>
                
                <p>위치: {item.workPlace}</p>
                <p>시급: {item.wage}</p>
                <p>
                  근무 시간: {item.workTime?.start} ~ {item.workTime?.end}
                </p>
              </div>
            ))
          ) : (
            <p>관련 알바가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbaDetail;