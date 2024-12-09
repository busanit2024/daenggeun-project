import React from "react";

export default function MyPageMain(props){

    return (
        <Wrapper>
            <ProfileBox>
                <img></img>
                <div>
                    <h5>닉네임</h5>
                    <h5>매너온도</h5>
                    <img>화살표</img>
                </div>
            </ProfileBox>
             {/* 나의 거래  */}
            <MyTradeBox>
                <p>나의 거래</p>
                <div>
                    <img>하트</img>
                    <span>관심목록</span>
                    <svg>화살표</svg>
                </div>
            </MyTradeBox>
            <MyLocationSetting>
                <div>
                    <svg></svg>
                    <h5>내 동네 설정</h5>
                </div>
                <div>
                    <svg></svg>
                    <h5>동네 인증하기</h5>
                </div>
            </MyLocationSetting>
    

        </Wrapper>
    );
}