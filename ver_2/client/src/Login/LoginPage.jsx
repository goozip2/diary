import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../Image/Logo.png";

const Background = styled.div`
  height: 100vh;
  width: 100%;
  background: url(/image/main_bg.jpg) no-repeat center;
  background-size: cover;
  background: #c0392b; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #ffdede,
    #a2a1ff
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #ffdede,
    #a2a1ff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const Label = styled.label`
  color: #7286d3;
  font-weight: bold;
`;

const SignUpLink = styled.a`
  color: #5475ed;
  font-weight: bold;
  text-decoration: none;
  font-size: large;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const LoginFormRectangle = styled.div`
  width: 397px;
  background-color: #f5f5f5;
  border-radius: 0.8em;
  box-shadow: 0px 7px 4px #00000040;
  padding: 50px;
  margin-top: 15%;
  position:relative;
`;

const Input = styled.input`
  color: black;
  background-color: transparent;
  padding: 8px 100px 3px 0px;
  margin: 10px 0px;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 0.8px;
  border-color: black;
  padding-left: 14px;
  text-align: left;
`;

const LoginButton = styled.button`
  color: white;
  font-weight: bold;
  padding: 6px 1px;
  background: #a2a1ff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 7px;
  margin-top: 50px;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 1px gray;
  }
`;

function LoginPage(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [dataList, setDataList] = useState([]);
  let summaryList;

  const dateToString = (tempData) => {
    const year = tempData.getFullYear();
    const month = tempData.getMonth() + 1;
    const date = tempData.getDate();

    return `${year}-${month >= 10 ? month : "0" + month}-${
      date >= 10 ? date : "0" + date
    }`;
  };

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onLoginHandler = async (event) => {
    event.preventDefault();

    console.log("login 버튼 클릭!");
    if (id === "" || password === "") {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const result = await axios
      .post("/members/login", {
        //서버로 id, password 전달
        id: id,
        password: password,
      })
      .then((res) => {
        console.log(res);
        // console.log("res.data.userId :: ", res.data.id);
        // console.log("res.data.msg :: ", res.data.msg);
        // console.log("res.data.token", res.data.token);

        if (res.data.code === 402) {
          // id는 있지만, pw 는 다른 경우 userId = null , msg = undefined
          console.log(
            "======================",
            "입력하신 비밀번호가 일치하지 않습니다."
          );
          alert("틀린 비밀번호입니다. 다시 시도해주세요.");
        } else if (res.data.code === 401) {
          // id가 아예 없는 경우
          console.log(
            "======================",
            "가입된 id가 아닙니다. 회원가입을 진행해주세요."
          );
          alert("가입된 id가 아닙니다. 회원가입을 진행해주세요.");
        } else if (res.data.code === 200) {
          // id, pw 모두 일치 userId = userId1, msg = undefined
          console.log("======================", "로그인 성공");
          sessionStorage.setItem("token", res.data.token);
          //localStorage.setItem("token", res.data.jwt); //(주석 제거 필요!!) 데이터 받아왔을 때 특정 이름으로 저장하는 거. 다른 곳에서 토큰 불러올 수 있게 처리하는 작업
          //localStorage.setItem("token", res.data.token);

          setDataList(res.data.dataList);
          summaryList = res.data.summaryList;
          console.log(res.data.dataList, ">>> ", res.data.summaryList)
          navigate("/members/home", {state: {dataList: res.data.dataList, summaryList: res.data.summaryList}});
        }
      })
      .catch((error) => {//404
        alert(
          "DataBase 연결 실패."
        );
        console.log("로그인 에러 발생", error.response);
      });
    console.log("Submit Button Click"); //확인용
  };
  //로그인 하고 로그인페이지 돌아오면 다시 홈으로 가도록 하는 기능 구현. (): 받아올 변수, {}: 실행할 코드, []: []에 들어있는 조건이 해당될 때만 렌더링 이외의 다른 정보를 다시 reload 하겠다!
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      axios.post("/members/tohome", {
        token: sessionStorage.getItem("token"),
        date: dateToString(new window.Date())
      })
      .then((res) => {
        console.log(res.data.dataList, " / ", res.data.summaryList)
        navigate("/members/home", { state: { dataList: res.data.dataList, summaryList: res.data.summaryList } });
      });
    }
  }, []);

  return (
      <Background>
          <center>
            <a href="/"><img src={Logo} style={{ marginTop: '100px', width: '200px' }} /></a>
          </center>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <LoginFormRectangle>
              <form style={{ display: "flex", flexDirection: "column", marginTop: '10px', marginBottom: '10px'}}>
                {/* <center>
                  <h1 style={{ color: "#616161" }}>로그인</h1>
                </center> */}
                <Label>아이디</Label>
                <Input type="text" onChange={onIdHandler} value={id} />
                <br />
                <br />
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  onChange={onPasswordHandler}
                  value={password}
                />
                <LoginButton onClick={onLoginHandler}>로그인</LoginButton>{" "}
              </form>
            </LoginFormRectangle>
            <Link to="/members/register">
              <br />
              <br />
              <center>
                <SignUpLink>회원가입</SignUpLink>
              </center>
            </Link>
          </div>
        </div>
      </Background>
  );
}
export default LoginPage;