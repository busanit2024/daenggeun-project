import React from "react";
import InputText from "../../ui/InputText";


export default function MyProfileEdit (props) {

    return (
        <Wrapper>
            <ProfileImgBox>
                <img></img>
                <svg>카메라</svg>
            </ProfileImgBox>
            <UserNameBox>
                <h4>닉네임</h4>
                <InputText></InputText>
            </UserNameBox>
        </Wrapper>

    );
}
