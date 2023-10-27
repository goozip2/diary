/*
[통계 기능 정리]
1) 월별 감정 개수 (연월% diary_write_date를 가진 행을 뽑아내서 diary_emotion 종류에 따라 count -> Json 형식 or list 형식으로 저장 -> res)
2) 플리 추천 기록

[req 항목]
- 현재 연월 정보
- token(user_id)

+) 월별 감정 개수 관련 쿼리: select count(diary_emotion) from diary where DIARY_WRITER_ID = "(사용자 아이디)" and diary_emotion="(감정 키워드)";    //아직 날짜 정보 대입 X
+) 월별 감정 개수 관련 쿼리: select count(diary_emotion) from diary where DIARY_WRITER_ID = "hello" and diary_write_date like "2023-02-__" and diary_emotion="분노";     //날짜 정보 대입 O
+) 플리 기록 관련 쿼리: SELECT playlist_title FROM playlist where playlist_id IN (SELECT distinct diary_playlist FROM diary where diary_writer_id = ?);

1) 월별 감정 개수 구현 방법
- 감정 키워드 7개 저장하는 리스트 생성
- 감정 키워드 리스트를 하나씩 돌면서 (for) 각 감정 키워드에 따른 일기 개수 세기

*/

var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  const token = req.body.token;
  const date = req.body.date; //현재 날짜 (오늘 날짜)
  const yearMonth = date.substring(0, 8) + "__"; //연월   2023-02-13
  const justDate_string = date.substring(8, 10);
  const justDate = Number(justDate_string);

  try {
    var check = jwt.verify(token, "secretKey");
    if (check) {
      console.log("token 검증", check.user_id);
    }
  } catch {
    console.log("token 검증 오류");
  }

  const id = check.user_id;

  db.getConnection((err, conn) => {
    //db 연결 실패 시,
    if (err) {
      console.log("Mysql 연결 실패");
      conn.release(); //커넥션 풀에 커넥션 반환 -> 연결 해제
      res.writeHead("404", { "content-Type": "text/html; charset=utf8" });
      res.write("<h2>DB 서버 연결 실패</h2>");
      res.end();
      return;
    }
    // db 연결 성공 시
    console.log("데이터베이스 conn");

    // 1) 월별 감정 개수 관련 쿼리
    //이슈사항1) emotion 별로 쿼리문을 날려야됨 (emotion 종류: 중립, 기쁨, 당황, 분노, 혐오, 슬픔, 불안)
    var json = {}; //front res로 보내줄 data
    let emo_arr = ["중립", "기쁨", "당황", "분노", "혐오", "슬픔", "불안"];
    let emo_count_arr = [];

    console.log(emo_arr);

    for (var i = 0; i < emo_arr.length; i++) {
      const exec = conn.query(
        "select count(diary_emotion) as COUNT from diary where DIARY_WRITER_ID = ? and diary_write_date like ? and diary_emotion=?;",
        [id, yearMonth, emo_arr[i]],
        (err, result) => {
          console.log("실행된 SQL: " + exec.sql);
          // sql 오류 시
          if (err) {
            console.log("SQL 실행 시, 오류 발생");
            console.dir(err);
            res.writeHead("200", {
              "content-Type": "text/html; charset=utf8",
            });
            res.write("<h2>SQL 실행 실패;</h2>");
            res.status(404).send("오류");
            res.end();
            return;
          } else {
            // sql 성공 시
            //오류가 없을 경우
            console.log("쿼리문 성공");
            console.log("result: ", result[0].COUNT);
            console.dir(result[0].COUNT);
            emo_count_arr.push(result[0].COUNT);
            console.log("내부 emo_count_arr", emo_count_arr);
            if (emo_count_arr.length == 7) {
              //conn.release();
              console.log("emo_count_arr", emo_count_arr);
              json.emo_count_arr = emo_count_arr;
              //console.log("json:", json);
              //res.send(json);
              //res.end();
            }
          }
        }
      );
    }

    // 2) 월 별 출석률
    const exec = conn.query(
      "select count(*) as write_count from diary where diary_writer_id = ? and diary_write_date like ?;",
      [id, yearMonth],
      (err, result) => {
        // sql 오류 시
        if (err) {
          console.log("SQL 실행 시, 오류 발생");
          console.dir(err);
          res.writeHead("200", {
            "content-Type": "text/html; charset=utf8",
          });
          res.write("<h2>SQL 실행 실패;</h2>");
          res.status(404).send("오류");
          res.end();
          return;
        } else {
          // sql 성공 시
          const write_count = Number(result[0].write_count);
          var attendance = (write_count / justDate) * 100;
          json.attendance_rate = attendance;
          console.log(json);
          //res.send(json);
          //res.end();

          // 3) 월별 카테고리 순위
          const exec = conn.query(
            "select category, sum(count) as count from (select * from keyword as k join (select diary_keyword, count(diary_keyword) as count from diary where diary_writer_id = ? and diary_write_date like ? and diary_keyword is not null group by diary_keyword) as n ON k.keyword = n.diary_keyword group by k.keyword) as a group by category order by count desc limit 5;",
            [id, yearMonth],
            (err, result) => {
              // sql 오류 시
              if (err) {
                console.log("SQL 실행 시, 오류 발생");
                console.dir(err);
                res.writeHead("200", {
                  "content-Type": "text/html; charset=utf8",
                });
                res.write("<h2>SQL 실행 실패;</h2>");
                res.status(404).send("오류");
                res.end();
                return;
              } else {
                // sql 성공 시
                let category_arr = [];
                let category_count_arr = [];
                //console.log("카테고리임0", result[0]);
                //console.log("카테고리임", result[0].category);
                console.log(result.length);

                for (var n = 0; n < 5; n++) {
                  if (n < result.length) {
                    category_arr.push(result[n].category);
                    category_count_arr.push(result[n].count);
                  } else {
                    category_arr.push("");
                    category_count_arr.push(0);
                  }
                }

                //
                /*
                for (var x = 0; x < result.length; x++) {
                  // 상위 5개 카테고리
                  category_arr.push(result[x].CATEGORY);
                  category_count_arr.push(result[x].count);
                }*/
                json.category_arr = category_arr;
                json.category_count_arr = category_count_arr;
                //

                // 4) 이달의 플레이 리스트(1위)
                const exec = conn.query(
                  "SELECT playlist_title, playlist_url FROM playlist where playlist_id IN (select diary_playlist from (SELECT diary_playlist, count(diary_playlist) FROM diary where diary_writer_id = ? AND diary_write_date like ? group by diary_playlist order by count(diary_playlist) desc limit 1) A);",
                  [id, yearMonth],
                  (err, result) => {
                    console.log("실행된 SQL: " + exec.sql);
                    // sql 오류 시
                    if (err) {
                      console.log("SQL 실행 시, 오류 발생");
                      console.dir(err);
                      res.writeHead("200", {
                        "content-Type": "text/html; charset=utf8",
                      });
                      res.write("<h2>SQL 실행 실패;</h2>");
                      res.status(404).send("오류");
                      res.end();
                      return;
                    } else {
                      // sql 성공 시
                      //오류가 없을 경우
                      console.log("쿼리문 성공");

                      console.log("플리 관련 result 길이", result.length);
                      if (result.length <= 0) {
                        json.playlist_title =
                          "이번 달 플리 추천 기록이 없습니다.";
                        json.playlist_url = "";
                        json.thumbnail_url = "https://cdn-icons-png.flaticon.com/512/2210/2210827.png";
                      } else {
                        let playlist_url = result[0].playlist_url;
                        let thumbnail = playlist_url.substring(32);
                        thumbnail =
                          "https://img.youtube.com/vi/" +
                          thumbnail +
                          "/maxresdefault.jpg";

                        json.playlist_title = result[0].playlist_title;
                        json.playlist_url = result[0].playlist_url;
                        json.thumbnail_url = thumbnail;
                        //console.log("json:", json);
                        //res.send(json); //프론트로 보내기
                        //res.end();
                      }

                      const exec = conn.query(
                        "select count(*) as cnt from diary where diary_writer_id = ?",
                        [id],
                        (err, result) => {
                          console.log("실행된 SQL: ", exec.sql);
                          // sql 오류 시
                          if (err) {
                            console.log("SQL 실행 시, 오류 발생");
                            console.dir(err);
                            res.writeHead("200", {
                              "content-Type": "text/html; charset=utf8",
                            });
                            res.write("<h2>SQL 실행 실패;</h2>");
                            res.status(404).send("오류");
                            res.end();
                            return;
                          } else {
                            // sql 성공 시
                            //오류가 없을 경우
                            console.log("쿼리문 성공");
                            console.log(result[0].cnt);
                            json.diary_count = result[0].cnt;
                            console.log("json:", json);
                            res.send(json); //프론트로 보내기
                            res.end();
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
});

module.exports = router;
