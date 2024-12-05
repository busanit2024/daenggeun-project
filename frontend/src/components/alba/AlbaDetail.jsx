import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AlbaStyled.css";
import { ImAlarm } from "react-icons/im";
import { ImCalendar } from "react-icons/im";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LiaWonSignSolid } from "react-icons/lia";

const AlbaDetail = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate(); // 상세 페이지 이동용
  const [job, setJob] = useState(null); // 상세 데이터 상태
  const [relatedJobs, setRelatedJobs] = useState([]); // 관련 알바 데이터 상태

  useEffect(() => {
    // 상세 데이터 로드
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/alba/${id}`);
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

    fetchJob();
    fetchRelatedJobs();
  }, [id]);

  if (!job) return <p>로딩 중...</p>; // 로딩 처리

  return (
    <div className="alba-detail-page">
      {/* 상세 영역 */}
      <div className="alba-detail-container">
        {/* 좌측 영역 */}
        <div className="detail-left">
          <img
            src={job.image.url || "default-image.png"}
            alt={job.title}
            className="detail-image"
          />
          <div className="profile-info">
            <h2>{job.title}</h2>
            <p>시급: {job.wage}</p>
          </div>
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

            <p>{job.description}</p>
            </div>

          <div className="detail-map">
              <iframe
              title="location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                job.location
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
                onClick={() => navigate(`/alba/${item.id}`)}
              >
                <h4>{item.title}</h4>
                <p>위치: {item.location}</p>
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