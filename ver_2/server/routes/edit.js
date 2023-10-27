var express = require('express');
var router = express.Router();
const crypto = require("crypto");
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

process.setMaxListeners(0);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({'message':'node get success'});
});

/* Post users listing. */
router.post('/',  (req, res) => {
    console.log("/members/edit 호출됨");
    const paramPassword = req.body.password;
    const paramId = req.body.id;
    console.log("받은 데이터 : ", paramId, paramPassword);

    var salt = Math.round(new Date().valueOf() * Math.random()) + "";
    var hashPassword = crypto
    .createHash("sha512")
    .update(paramPassword + salt)
    .digest("hex");

    db.getConnection((err, conn) => {
    
        // 1. sql 연결 문제 -> db 커넥션 문제 발생할 시 실행되는 함수
            // sql 연결 실패 시
            if (err) {
                console.log("Mysql 연결 실패")
                conn.release(); //커넥션 풀에 커넥션 반환 -> 연결 해제
                res.writeHead("404", { "content-Type": "text/html; charset=utf8" });
                res.write("<h2>DB 서버 연결 실패</h2>");
                res.end();
                return;
            }
    
            // sql 연결 성공 시
            console.log("데이터베이스 conn");
        // sql qeury문 삽입 -> ?에 순서대로 대괄호 안의 내용이 삽입됨
        const exec = conn.query(
          "update user set user_password = ?, salt = ? where user_id = ?;",
          [hashPassword, salt, paramId],
                //sql query 실행 실패, 혹은 성공할 경우에 대한 코드
                (err, result) => {
                    conn.release();
                    console.log("실행된 SQL: " + exec.sql);
      
                    // 2. 생각해야함
                    if (err) {
                        console.log("SQL 실행 시 오류 발생; 아이디 중복 문제");
                        console.dir(err);
                        res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
                        res.write("<h2>SQL 실행 실패; 아이디 중복 문제</h2>");
                        res.end();
                        res.status(404).send('중복!! Sorry, we cannot find that!')
                        return;
                    }
      
                    if (result) {
                        console.dir(result);
                        console.log("회원정보 변경 성공");
                        res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
                        res.end();
                    } 
                    //생각 해야함
                    else {
                        console.log("회원정보 변경 실패");
                        res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
                        res.write("<h2>사용자 추가 실패</h2>");
                        res.end();
                    }
                }
            );
        });
    
});

module.exports = router;