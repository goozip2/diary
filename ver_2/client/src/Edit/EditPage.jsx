import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../Image/Logo.png";

const Header = styled.header`
  top: 0;
  width: 100%;
  height: 100px;
  background-color: #e5e0ff;
`;

const Label = styled.label`
  font-size: 14px;
  color: #373a3c;
  font-family: AbeeZee;
  margin: 4px;
`;

const IdInput = styled.input`
  color: #999999;
  margin: 1px 0px;
  padding: 8px 100px 3px 0px;
  background-color: #e8e8e8;
  border: none;
  border-radius: 4px;
  border-width: 1.4px;
  padding-left: 14px;
  font-size: 14px;
  font-family: AbeeZee;
`;

const Input = styled.input`
  color: #999999;
  padding: 8px 100px 3px 0px;
  background: white;
  border-radius: 4px;
  border-width: 1.4px;
  border-color: #cccccc;
  padding-left: 14px;
  text-align: left;
  font-family: AbeeZee;
`;

const SubmitButton = styled.button`
  color: white;
  font-weight: bold;
  width: 270px;
  margin-bottom: 5px;
  padding: 5px 1px;
  background: #a2a1ff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 7px;

  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 1px gray;
  }
`;

const CancelButton = styled.button`
  color: #aeaeae;
  font-weight: bold;
  width: 270px;
  padding: 5px 1px;
  background: #e5e5e5;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 7px;

  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 1px gray;
  }
`;

function EditPage(props) {
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // <임시 post 코드: db에서 회원의 id를 가져와서 화면에 보여줘야 함>
  // 당연하지만 작동하지 않고 주석 해제하면 오류남
  // const reqOption = {
  //     url = "http://localhost:3000/members/test/edit",
  //     methond: 'POST',
  //     header:{

  //     }
  // }
  // axios
  // .then(response => setId(response.data));
  //받아온 id를 setId에 넣어줌, response 객체를 string으로 변환해야 할 듯
  //edit 저장 누르면 토큰 없애고 navigate로 로그인 화면으로
  axios
    .get("/members/edit")
    .then(function () {
      let token = sessionStorage.getItem("token");
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
  // 응답(항상 실행)
  let isPassword = false;
  let isPasswordConfirm = false;

  // <공백 제거 함수>
  const delSpace = (data) => {
    return data.replace(/\s/g, "");
  };

  //const [id, setId] = useState(token_id);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dateToString = (tempData) => {
    const year = tempData.getFullYear();
    const month = tempData.getMonth() + 1;
    const date = tempData.getDate();

    return `${year}-${month >= 10 ? month : "0" + month}-${
      date >= 10 ? date : "0" + date
    }`;
  };

  const onPasswordHandler = (event) => {
    setPassword(delSpace(event.currentTarget.value));
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onBackButtonHandler = async (event) => {
    event.preventDefault();

    axios
      .post("/members/mypage", {
        token: token,
        date: dateToString(new window.Date()),
      })
      .then((res) => {
        console.log(res.data);
        navigate("/members/mypage", { state: { myData: res.data } });
      })
      .catch((error) => {
        console.log(error);
        alert("마이페이지를 여는 데 문제가 생겼습니다.");
      });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (password.length <= 0 || confirmPassword.length <= 0)
      return alert("비밀번호와 비밀번호 확인을 모두 입력해주세요.");

    const regExp = /^(?=.*?[a-zA-Z])(?=.*?[#?!@$ %^&*-]).{8,40}$/;

    isPassword = regExp.test(password);

    if (!isPassword) {
      return alert("형식에 맞지 않는 비밀번호입니다.");
    }

    if (password === confirmPassword) {
      isPasswordConfirm = true;
    }

    if (!isPasswordConfirm)
      return alert("비밀번호와 비밀번호 확인이 같지 않습니다.");

    alert("비밀번호가 변경되었습니다. 다시 로그인해주세요!");
    //이제 db에 수정사항 전송

    const result = await axios
      .post("/members/edit", {
        //서버로 id, password 전달
        id: id,
        password: password,
      })
      .then((res) => {
        console.log("서버로 수정된 비밀번호가 전달 되었습니다");
        //console.log("토큰 삭제 전", localStorage.getItem('token'))
        sessionStorage.clear();
        //console.log("토큰 삭제 후", localStorage.getItem('token'))
        navigate("/members/login");
      });
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
        navigate("/members/home", { state: { dataList: res.data.dataList, summaryList: res.data.summaryList }  });
      });
  };

  return (
    <div>
      <Header>
        <img onClick={onBackHandler} src={Logo} style={{ margin: '30px', marginTop: '30px', height: '40px' }} />
      </Header>
      <div style={{marginTop: '4%'}}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <div>
              <h1 align="center" style={{ marginTop: "50px" }}>
                회원정보 수정
              </h1>
              <br />
            </div>
            <form style={{ display: "flex", flexDirection: "column" }}>
              <Label>아이디</Label>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <IdInput type="text" size="70" placeholder={id} disabled />
              </div>
              <br />
              <br />

              <Label>비밀번호</Label>
              <Input
                type="password"
                defaultValue={password || ""}
                onChange={onPasswordHandler}
                placeholder="1개 이상의 특수문자를 포함하고 8자 이상, 40자 이하여야 합니다."
              />

              {/* <Message >{passwordMessage}</Message> */}
              <br />
              <br />

              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                defaultValue={confirmPassword || ""}
                onChange={onConfirmPasswordHandler}
                placeholder="비밀번호 확인을 위해 비밀번호를 한 번 더 입력하세요."
              />
              <br />
              <br />
              <br />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <SubmitButton type="submit" onClick={onSubmitHandler}>
                  완료
                  {/* 완료 클릭 이후 Mypage로 가야 함.  */}
                </SubmitButton>
                <br></br>
                <CancelButton onClick={onBackHandler}>취소</CancelButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;