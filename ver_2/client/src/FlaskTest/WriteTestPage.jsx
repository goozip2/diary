import React, { useState } from 'react';
import axios from 'axios';

function WriteTestPage() {
    const [diary, setdiary] = useState("");
    const [displaytext, setTextData] = useState(null);

    const onWriteHandler = (event) => {
        setdiary(event.currentTarget.value);
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        axios.post('/writetest', {
        // const result = await axios.post('/writetest', {
            text: diary, //post로 보낼 데이터
        })
            .then((response) => {
                console.log(response.data);
                setTextData(response.data.data.json.result);
            })
            .catch((error) => {
                console.log(error.response);
            });
        console.log("Submit Button Click"); //확인용
    }
    return (
        <div>
            <div>
                <h1>일기 쓰기</h1>
                <form>
                    <h2>일기</h2>
                    <textarea type='text' cols="40" rows="10" value={diary} onChange={onWriteHandler} placeholder="ex) 나는 오늘 일기를 쓸 것이다."></textarea>
                    <button type='submit' onClick={onSubmitHandler}>일기 전송</button>
                </form>
                {displaytext && <h2>{JSON.stringify(displaytext)}</h2>}
            </div>
        </div>
    )
}

export default WriteTestPage;