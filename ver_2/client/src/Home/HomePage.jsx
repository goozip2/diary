import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate , useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "./DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko';
import TodayLines from "./TodayLines";
import Logo from "../Image/Logo.png";

const Header = styled.header`
  top: 0;
  width: 100vw;
  height: 100px;
  flex-direction: row;
  background-color: #e5e0ff;
`;

const Layout = styled.div`
  padding-top: 10px;
  width: 100vw;
  height: 80vh; //없애면 요약문 크기만큼 유동적으로 작아짐
  display: flex;
  flex-direction: row;
`;

const CustomButton = styled.button`
  color: #8F8F8F;
  background: #F5F5F5;
  font-weight: bold;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  margin-right: 15px;
  margin-top: 30px;
  float: right;
  padding: 10px 20px;
  &:hover {
      cursor: pointer;
  }
  &:focus{
      box-shadow: 0 0 0 1px gray;
  }
`;

const Button = styled.button`
  color: #8F8F8F;
  background: #F5F5F5;
  font-weight: bold;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  margin-right: 15px;
  margin-top: 30px;
  float: right;
  padding: 10px 20px;
  &:hover {
      cursor: pointer;
  }
  &:focus{
      box-shadow: 0 0 0 1px gray;
  }
`;

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const calRef = useRef();
  const [id, setId] = useState("");
  const [startDate, setStartDate] = useState(new window.Date());

  const [dateList, setDateList] = useState(location.state.dataList);
  const [summaryList, setSummaryList] = useState(location.state.summaryList);

  // let dateList = location.state.dataList;
  // let summaryList = location.state.summaryList;
  // const dateList = location.state.dataList;
  // const summaryList = location.state.summaryList;
  let tempDate;

  const dataList = [];

  for (let i = 0; i< dateList.length; i++){
    dataList.push(new Date(dateList[i]));
  };

  //달에 따른 요약문 변경을 위해 서버에 보내는 틀 맞춤
  const innerHtmlToString = (d) =>{
    const rmBlank = d.split(' ');
    const month = rmBlank[0].split('월')[0];
    const year = rmBlank[1].split('월')[0];
    // const year = rmBlank[0].split('년')[0];
    // const month = rmBlank[1].split('월')[0];
    return `${year}-${month>= 10 ? month : "0" + month}-${"01"}`;
  }

  //왼쪽
  const innerHtmlToStringPrev = (d) =>{
    const rmBlank = d.split(' ');
    let month = parseInt(rmBlank[0].split('월')[0]);
    let year = parseInt(rmBlank[1].split('월')[0]);

    if (month == 1) {
      month = 12;
      year = year - 1;
    }
    else {
      month = month - 1;
    }

    return `${year}-${month>= 10 ? month : "0" + month}-${"01"}`;
  }
  //오른쪽
  const innerHtmlToStringNext = (d) =>{
    const rmBlank = d.split(' ');
    let month = parseInt(rmBlank[0].split('월')[0]);
    let year = parseInt(rmBlank[1].split('월')[0]);
    console.log(year, month)
    if (month == 12) {
      month = 1;
      year = year + 1;
    }
    else {
      month = month + 1;
    }
    console.log(year, month)
    return `${year}-${month>= 10 ? month : "0" + month}-${"01"}`;
  }

  useEffect(()=>{
		//prevMonth: < 눌렀을때 실행할 콜백함수
    const prevMonth = async()=>{
      var nowDate = document.querySelector(".react-datepicker__current-month").innerHTML; //왼쪽 버튼 눌러도 일단 이 값은 누르기 전의 값임. (2월에서 왼쪽 눌러도 이 값은 2임)
      console.log("nowDate: ", nowDate);
      console.log("서버로 전달되는 날짜:",innerHtmlToStringPrev(nowDate))
      await axios.post('/members/tohome',{
          //서버로 토큰과 날짜 전달
          token: sessionStorage.getItem("token"),
          date: innerHtmlToStringPrev(nowDate)
        })
        .then((res) => {
          console.log("1월꺼", res)
          setDateList(res.data.dataList);
          setSummaryList(res.data.summaryList);
          //dateList = res.data.dataList;
          //summaryList = res.data.summaryList;
        })
        .catch((error) => {
        });
      //window.alert("<버튼 클릭"); //eventListner 제대로 동작하는지 확인하는 용도
    }

		//nextMonth: > 눌렀을때 실행할 콜백함수
    const nextMonth = async()=>{
      var nowDate = document.querySelector(".react-datepicker__current-month").innerHTML;
      console.log("nowDate: ", nowDate);
      console.log("서버로 전달되는 날짜:",innerHtmlToStringNext(nowDate))
      await axios.post('/members/tohome',{
          //서버로 토큰과 날짜 전달
          token: sessionStorage.getItem("token"),
          date: innerHtmlToStringNext(nowDate)
        })
        .then((res) => {
          console.log("Next 실행", res)
          setDateList(res.data.dataList);
          setSummaryList(res.data.summaryList);
          //dateList = res.data.dataList;
          //summaryList = res.data.summaryList;
        })
        .catch((error) => {
        });
      //window.alert("> 클릭");
    }
		
		//DOM에서 날짜 버튼들 가져오기
    const btnPrev = document.querySelector(".react-datepicker__navigation--previous");
    const btnNext = document.querySelector(".react-datepicker__navigation--next");
    //해당 버튼에 클릭했을 때의 이벤트 리스너를 달아줌
		btnPrev.addEventListener("click", prevMonth);
    btnNext.addEventListener("click", nextMonth); 
  },[]) //자원을 아끼기 위해 처음 렌더링됐을때만 리스너를 달아주도록 빈 배열을 줌


  // useEffect(()=>{
  //   function click(event){
  //     window.alert("클릭");
  //   }

  //   const btnPrev = document.querySelector(".react-datepicker__navigation--previous");
  //   btnPrev.addEventListener("click", click);
  //   const btnNext = document.querySelector(".react-datepicker__navigation--next");
  //   btnNext.addEventListener("click", click); 
  // },[])

  axios
    .get("/members/edit")
    .then(function () {
      const token = sessionStorage.getItem("token");
      var base64Url = token.split(".")[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var result = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        )
      );
      let login_id = result.user_id;
      console.log(login_id);
      setId(login_id);
    })
    // 응답(실패)
    .catch(function (error) {
      console.log(error);
    });

  // 로그아웃
  const onLogoutButtonHandler = () => {
    let token = sessionStorage.getItem("token");
    sessionStorage.clear();
    navigate('/');
  };

  //서버 전달용: 영문식 달력에서 온 date를 한국 스타일의 string 형식(연-월-일)으로 변환
  const dateToString = (tempData) => {
    const year = tempData.getFullYear();
    const month = tempData.getMonth() + 1;
    const date = tempData.getDate();

    return `${year}-${month >= 10 ? month : "0" + month}-${
      date >= 10 ? date : "0" + date
    }`;
  };

  //검색용: highlighted인 날짜를 찾기 위해 highlighted에 저장되는 날짜 형식인 (월.일.연도)로 변환
  const dateToStringForSearch = (d) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    return  `${month >= 10 ? month : "0" + month}.${
      date >= 10 ? date : "0" + date
    }.${year}`;
  };

  const onDatePickHandler = async (date) => {
    tempDate = date;

    console.log(">>>>tempDate : ", tempDate)

    //setStartDate(date); //*** 얘로 console 찍으면 당일 날짜 나옴 ***
    //console.log(">>>>startDate : ", startDate)

    const highlightDates = calRef.current.state.highlightDates;

    // <작성한 내용이 있으면 읽기 페이지로, 없으면 쓰기 페이지로> 
    // 이 페이지가 렌더링될 때 서버에서 일기가 있는 페이지 정보를 받아오면
    // 그 정보를 DatePicker의 highlighted에 넣어 일기가 있는 페이지의 날짜는 회색 동그라미가 그려짐
    // 이를 이용해 날짜를 highlighted map에서 검색했을 때 날짜가 존재하면 일기가 있는 날짜로 간주함

    if(highlightDates.has(dateToStringForSearch(tempDate))===true){ //선택한 날짜가 highlighted 상태 
      //diary로 이동 시 URL로 date, user_id 전달
        await axios
        .post("/diaries", {
          token: sessionStorage.getItem("token"),
          date: dateToString(tempDate) //클릭한 날짜로 바꿔야됨
        })
        .then((res) => {
          console.log("서버로 date와 id가 전달되었습니다.");
          navigate("/diaries", {state: {dailyData: res.data}}); //diary.js로부터 받은 일기 데이터를 DiaryPage.jsx로 넘김
        })
        .catch((error) => {
          console.log(error);
          alert('일기 정보를 가져오는데 실패했습니다.')
        });
    }
    else{ 
      navigate("/members/test/write", {state: {selectedDate: date}});
    }
      };

  const onMypageButtonHandler = (event) =>{
    var nowDate = dateToString(new window.Date())

    axios.post("/members/mypage", {
      token: sessionStorage.getItem("token"),
      date: nowDate
    })
    .then((res) => {
      console.log("하이>>>>", res.data)
      console.log("nowDate: ", nowDate)
      navigate("/members/mypage", {state: {myData: res.data}});
    })
    .catch((error) => {
      console.log(error);
      alert('마이페이지를 여는 데 문제가 생겼습니다.')
    });
  }

  return (
    <>
      <Header>
        <img src={Logo} style={{ margin: '30px', marginTop: '30px', height: '40px' }} />
        <div style={{float: 'right', display: 'inline-block'}}>
          <CustomButton style={{marginRight: '40px'}} onClick={onLogoutButtonHandler} >로그아웃</CustomButton>
          <Link to="/members/edit"><Button>회원정보 수정</Button></Link> {}
          <CustomButton onClick={onMypageButtonHandler}>AI 일기 분석</CustomButton>
        </div>
      </Header>
      <Layout> 
        {/* <h4>{id}님 환영합니다</h4>*/}
        {/* <h2 style={{color:'#AEAEAE', fontFamily:'AbeeZee'}}>당신의 소중한 하루를 기록해보세요.</h2><br/> */}
        <DatePicker 
            onChange={(date)=>onDatePickHandler(date)}
            selected={startDate}
            locale={ko} 
            highlightDates={dataList}
            //highlightDates={[new Date('2023-02-12'), new Date('2023-02-11') ]}
            // highlightDates는 Map이고 []안만 찍어보면 배열 
            ref={calRef}
            inline
            >         
        </DatePicker> 
        <TodayLines dateList={dateList} summaryList={summaryList} />
      </Layout> 
    </>
  );
}

export default HomePage;