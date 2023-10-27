import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import moment from 'moment';
import 'moment/locale/ko';

const SummaryBox = styled.div`
    font-family: AbeeZee;
    border-radius: 4px;
    margin-top: 60px;
    margin-left: 50px;
    margin-right: 100px;
    width:80%;
    height: 87%;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
    border: none ;
    overflow-y: auto;
`;

const TodayLine = styled.div`
    border: none;
    border-radius: 6px;
    margin: 20px 30px;
    padding: 10px 30px;
    background: #e5ebff;
    &:nth-child(2n){
        background: #FFE3E3;
    }
`;

function TodayLines({dateList, summaryList}){
  const dataList = [];

  for (let i = 0; i< dateList.length; i++){
    dataList.push(dateList[i].substring(0, 10));
    console.log(dateList[i].substring(0, 10))
  };

  return(
    <>
      
      <SummaryBox>
      <h2 style={{textAlign: 'center', color: '#828282'}}>AI가 요약한 당신의 하루</h2>
        {
          summaryList.map((summary, idx) => (<TodayLine key={idx}><h3 style={{marginTop: '0px', marginBottom: '7px'}}>{dataList[idx]}</h3><div>{summary}</div></TodayLine>))
        }
      </SummaryBox>
    </>
  );
}

export default TodayLines;