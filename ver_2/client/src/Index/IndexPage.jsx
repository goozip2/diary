import {React, useRef} from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import DiaryIntroduction from './DiaryIntroduction';
import Logo from "./Logo.png";
import HomePageImage from "./HomePageImage.png";
import DiaryPageImage from "./DiaryPageImage.png";
import MypageImage from "./MypageImage.png";
import AnchorLink from 'react-anchor-link-smooth-scroll';
import './IndexPage.css';

const TopBarContainer = styled.div`
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top:0;
    height: 100px;
    width:100%;
    background-color: white;
    padding: 0 20px;
`;

const LeftContents = styled.div`
    display: flex;
    margin-left: 0px;
`;

const Content = styled.div`
    margin: 50px;
    margin-right: 0px;
    font-family: AbeeZee;
    font-size: 21px;
    font-weight: bold;
    color: #A27CB9;
    &:hover{
        color:orange;
    }
`;

const LoginButton = styled.button`
    color: #8F8F8F;
    background: #F5F5F5;
    font-weight: bold;
    border: none;
    font-size: 16px;
    border-radius: 4px;
    margin-left: 30px ;
    margin-right: 50px;
    padding: 8px 16px;
    height: 50px;
    &:hover {
        cursor: pointer;
    }
    &:focus{
        box-shadow: 0 0 0 1px gray;
    }
`;

const Empty = styled.div`
    height:70px;
`;

const HomeImg = styled.img.attrs({
    src: `${HomePageImage}`,
})`
    max-width: 70%;
    height: 65%;
    box-shadow: 5px 5px 4px 4px #00000040;
    margin-top: 25px;
    margin-bottom: 40px;
`;

const DiaryImg = styled.img.attrs({
    src: `${DiaryPageImage}`,
})`
    max-width: 60%;
    height: 65%;
    margin-bottom: 30px;
`;

const MypageImg = styled.img.attrs({
    src: `${MypageImage}`,
})`
    max-width: 65%;
    height: 65%;
    margin-top: 25px;
    box-shadow: 5px 5px 4px 4px #00000040;
`;

function IndexPage(){
    const idxRef = useRef(null);

    return(
        <>
            <TopBarContainer>
            {/* <img src={Logo} style={{ margin: '30px', marginTop: '30px', height: '40px' }} /> */}
                <LeftContents >
                <img src={Logo} style={{ margin: '30px', marginTop: '42px', height: '40px' }} />
                    <AnchorLink href="#section1"><Content >컨텐츠 추천</Content></AnchorLink>
                    <AnchorLink href="#section2"><Content >일기 한달분석</Content></AnchorLink>
                    <AnchorLink href="#section3"><Content >월별 일기 요약</Content></AnchorLink>
                </LeftContents>
                <Link to="/members/login">
                    <LoginButton>로그인</LoginButton>
                </Link>
            </TopBarContainer>
            <section id="section1">
                <Empty ref={idxRef}/>
                <div style={{border: 'none', marginTop: '50px'}}></div>
                <DiaryIntroduction title={"당신의 하루에 꼭 맞는 컨텐츠 추천"} description={"일기를 작성하면, AI가 오늘 하루와 어울리는 플레이리스트와 사이트를 추천해드립니다."} />
                <DiaryImg src="./DiaryImage.png" alt="MypageImage"></DiaryImg>
            </section> 
            <section id= "section2">
                <Empty ref={idxRef}/>
                <DiaryIntroduction title={"섬세한 한 달 분석"} description={"이번 달의 일기를 다양한 분석과 함께 살펴보세요."}/>
                <MypageImg src="./MypageImage.png" alt="MypageImage"></MypageImg>
            </section>
            <section id= "section3">
                <Empty ref={idxRef}/>
                <div style={{border: 'none', marginTop: '91px'}}></div>
                <DiaryIntroduction title={"깔끔한 하루 한줄요약"} description={"하루에도 요약이 필요해! AI가 당신의 하루를 명쾌하게 요약해드립니다."}/>
                <HomeImg src="./HomePageImage.png" alt="MypageImage" />
            </section> 
            </>
    );
}

export default IndexPage;