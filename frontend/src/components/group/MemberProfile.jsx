import { useOutletContext, useParams } from "react-router-dom";
import { Container } from "./GroupPageLayout";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { calculateDate } from "../../utils/calculateDate";
import InputText from "../ui/InputText";
import { FaEdit, FaPen } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import Button from "../ui/Button";
import axios from "axios";

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
  padding: 24px 48px;
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  
  .nameWrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .name {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    gap: 4px;
    align-items: center;
  }
.nickname {
    color: #666666;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .nickname-input {
    display: flex;
    gap: 4px;
    align-items: center;
  }
`;

const ProfilePic = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #dcdcdc;
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RecordContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  
  .recordItem:not(:last-child) {
    border-right: 1px solid #dcdcdc;
  }

  .recordItem {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
  }
`;

const DescContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .desc {
    margin-bottom: 32px;
  }

  .moreinfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: #666666;
  }
`;

const positionData = [
  { enum: 'ADMIN', name: '모임장' },
  { enum: 'MANAGER', name: '운영진' },
  { enum: 'MEMBER', name: '일반멤버' },
]

export default function MemberProfile() {
  const { group } = useOutletContext();
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (group && group.members) {
      const id = memberId ?? sessionStorage.getItem('uid');
      const member = group?.members.find((member) => member.userId === id);
      setMember(member);
      setNickname(member?.groupNickName);
      console.log(member);
    }
  }, [group, memberId]);


  const getPosition = (position) => {
    return positionData.find((data) => data.enum === position)?.name;
  }

  const handleEditNickname = () => {
    if (nickname === member?.groupNickName) {
      return;
    }

    const newGroup = group;
    newGroup.members = newGroup.members.map((m) => {
      if (m.userId === member.userId) {
        m.groupNickName = nickname;
      }
      return m;
    });

    setMember((prev) => ({ ...prev, groupNickName: nickname }));

    axios.post(`/api/group/save`, newGroup).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.error("닉네임 변경에 실패했습니다." + error);
    });

    setIsEditing(false);
  }


  return (
    <Container>
      <InnerContainer>
        <ProfileContainer>
          <ProfilePic>
            <img src={member?.profileImage?.url ?? '/images/defaultProfileImage.png'} alt="프로필 이미지" />
          </ProfilePic>
          <div className="nameWrap">
            <div className="name">{member?.username ?? '멤버이름'}
              <img height={22} src={`/images/icon/group_${member?.position?.toLowerCase()}.svg`} alt={member?.position} />
            </div>
            {group.useNickname &&
              <>
                {!isEditing && (
                  <div className="nickname">{member?.groupNickName ?? '모임 별명'}
                    <FaPen onClick={() => setIsEditing(true)} />
                  </div>
                )}
                {isEditing && (
                  <div className="nickname-input">
                    <InputText underline value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    <Button title={'변경'} onClick={handleEditNickname} />
                    <Button title={'취소'} onClick={() => { setNickname(member?.groupNickName); setIsEditing(false); }} />
                  </div>
                )}
              </>}


          </div>
        </ProfileContainer>

        <RecordContainer>
          <div className="recordItem">
            <div>게시글</div>
            <div>{member?.posts?.length ?? 0}</div>
          </div>
          <div className="recordItem">
            <div>댓글</div>
            <div>{member?.comments?.length ?? 0}</div>
          </div>
          <div className="recordItem">
            <div>참여한 일정</div>
            <div>{member?.assigns?.length ?? 0}</div>
          </div>
        </RecordContainer>

        <DescContainer>
          <div className="desc">소개글</div>
          <div className="moreinfo">
            <div>본인인증 완료</div>
            <div>{getPosition(member?.position)}</div>
            <div>{calculateDate(member?.registeredDate)} 전에 가입</div>
            <div>{member?.location?.[0]?.emd ?? '지역'}</div>
          </div>
        </DescContainer>

      </InnerContainer>

    </Container>
  );
}