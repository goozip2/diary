import React, { useref } from 'react';
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import {PieChart, Pie, Tooltip, Cell, Legend} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MyAttendance from "./MyAttendance";
//import IndexLogoPurple from "./IndexLogoPurple.jpg";
import Logo from "../Image/Logo.png";

const Header = styled.header`
  top: 0;
  width: 100%;
  height: 100px;
  background-color: #E5E0FF;
`;
const Layout = styled.div`
  width: 100vw;
  margin-top: 30px;
  height: 80vh;
  display: grid;
  flex-direction: column;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "left right";
`;

const Title = styled.img`
    margin:30px;
    width: 140px;
    color:#A27CB9;
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
const TopLeft = styled.div`
  width: 90%;
  height: 300px;
  margin: 0 auto;
  background: #F5F5F5;
  text-align: center;
  border-radius: 30px;
  margin-left: 60px;
  margin-bottom: 15px;
`;
const TopRight = styled.div`
  width: 90%;
  height: 300px;
  margin: 0 auto;
  background: #F5F5F5;
  text-align: center;
  border-radius: 30px;
  margin-right: 60px;
  margin-bottom: 15px;
`;
const BottomLeft = styled.div`
  width: 90%;
  height: 300px;
  margin: 0 auto;
  background: #F5F5F5;
  text-align: center;
  border-radius: 30px;
  margin-left: 60px;
  margin-top: 15px;
`;
const BottomRight = styled.div`
  width: 90%;
  height: 300px;
  margin: 0 auto;
  background: #F5F5F5;
  text-align: center;
  border-radius: 30px;
  margin-right: 60px;
  margin-top: 15px;
`;


function Mypage(){
    const location = useLocation();
    const navigate = useNavigate();
    const myData = location.state.myData;

    let emo_count_arr = myData.emo_count_arr;
    let book_title = myData.book_title;
    let book_url = myData.book_url;
    let book_image_url = myData.book_image_url;
    let book_writer = myData.book_writer;
    let movie_title = myData.movie_title;
    let movie_url = myData.movie_url;
    let movie_image_url = myData.movie_image_url;
    let movie_producer = myData.movie_producer;
    let attendance_rate = Math.floor(myData.attendance_rate);
    let diary_count = myData.diary_count;

    console.log(myData)

    const data = [
    {name: "중립", value: emo_count_arr[0]},
    {name: "기쁨", value: emo_count_arr[1]},
    {name: "당황", value: emo_count_arr[2]},
    {name: "분노", value: emo_count_arr[3]},
    {name: "혐오", value: emo_count_arr[4]},
    {name: "슬픔", value: emo_count_arr[5]},
    {name: "불안", value: emo_count_arr[6]},
  ];
  const COLORS = ['#AB8FDA', '#F89D81', '#F9C62B', '#ED5565', '#9B9FA7', '#87C1F5', '#515966'];

  const CustomBar = ({ x, y, width, height, value, background, label }) => (
    <g>
      <image href={background} x={x} y={y} width={width} height={height} />
      <text x={x + width + 5} y={y + height / 2} dy="0.35em">
        {label}
      </text>
      {/* <text x={x + 5} y={y + height / 2} textAnchor="end" dy="0.35em">
        {value}
      </text> */}
    </g>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#fff', padding: '5px' }}>
          <div style={{ fontWeight: 'bold' }}>{data.name}</div>
          <div>일기 개수: {data.value}</div>
          <div>비율: {data.ratio}</div>
        </div>
      );
    }
    return null;
  };

  const dateToString = (tempData) => {
    const year = tempData.getFullYear();
    const month = tempData.getMonth() + 1;
    const date = tempData.getDate();

    return `${year}-${month >= 10 ? month : "0" + month}-${
      date >= 10 ? date : "0" + date
    }`;
  };

  const onBackHandler = async (event) => {
    event.preventDefault();

    console.log("이전 버튼 클릭!");

    const result = await axios
      .post("/members/tohome", {
        //서버로 id, password 전달
        token: sessionStorage.getItem("token"),
        date : dateToString(new window.Date())
      })
      .then((res) => {
        console.log(res);
        console.log("MyPage에서 이전 버튼 누름- dataList : ",res.data.dataList, ", summaryList : ", res.data.summaryList);
        navigate("/members/home", { state: { dataList: res.data.dataList, summaryList: res.data.summaryList }  });
      });
  };

    return(
    <>
    <Header>
      <img onClick={onBackHandler} src={Logo} style={{ margin: '30px', marginTop: '30px', height: '40px' }} />
      <Button onClick={onBackHandler}>이전</Button>
    </Header>
    <Layout>
        {/* <h1 style={{fontWeight: 'normal'}}>MyPage</h1> */}
        <TopLeft>
            <h3>이번 달 감정 통계</h3>
            <div style={{display: 'flex', justifyContent: 'center', textItems: 'center'}}>
                <PieChart width={300} height={230}>
                    <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={data}
                        cx={100}
                        cy={100}
                        innerRadius={40} outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend verticalAlign="middle" layout="vertical" align="right"/>
                    <Tooltip />
                </PieChart>
            </div>
        </TopLeft>
        <TopRight>
        <h3>이번 달 나의 출석율</h3>
            <br></br>
            <MyAttendance rate = {attendance_rate}/>
        </TopRight>
        <BottomLeft>
            <h3 style={{marginBottom: '0.1em'}}>이달의 추천 도서 (월별 빈도수 1위)</h3>
            <div>
            <a href={book_url} target='_blank'><img src={book_image_url} onerror="this.src='http://www.hanbit.co.kr/images/common/logo_hanbit.png'" style={{height: '180px', borderRadius: '7px'}}/></a><br />
              <a href={book_url} target='_blank' style={{fontSize: '20px', fontWeight: 'normal', textDecoration: 'none', color: 'black'}}>{'<'}{book_title}{'>'}<br></br></a>
              <h>{book_writer}</h>
            </div>
        </BottomLeft>
        <BottomRight>
        <h3 style={{marginBottom: '0.1em'}}>이달의 추천 영화 (월별 빈도수 1위)</h3>
            <div>
            <a href={movie_url} target='_blank'><img src={movie_image_url} onerror="this.src='http://www.hanbit.co.kr/images/common/logo_hanbit.png'" style={{height: '180px', borderRadius: '7px'}}/></a><br />
              <a href={movie_url} target='_blank' style={{fontSize: '20px', fontWeight: 'normal', textDecoration: 'none', color: 'black'}}>{'<'}{movie_title}{'>'}<br></br></a>
              <h>{movie_producer}</h>
            </div>
        </BottomRight>
    </Layout>
    </>
    );
}

export default Mypage;