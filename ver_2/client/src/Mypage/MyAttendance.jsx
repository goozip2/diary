import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import LiquidFillGauge from "react-liquid-gauge";

function MyAttendance ({rate}) {
//   state = {
//     value: 70
//   };
//   startColor = "#6495ed"; // cornflowerblue
//   endColor = "#dc143c"; // crimson

    // const rate = 60;
    const radius = 80; // 원 크기
    const interpolate = interpolateRgb("#6495ed", "#dc143c");
    const fillColor = interpolate(rate / 100);
    const gradientStops = [
      {
        key: "0%",
        stopColor: color(fillColor)
          .darker(0.5)
          .toString(),
        stopOpacity: 1,
        offset: "0%"
      },
      {
        key: "50%", // 색이 바뀌는 기준점
        stopColor: fillColor,
        stopOpacity: 0.75,
        offset: "50%"
      },
      {
        key: "100%",
        stopColor: color(fillColor)
          .brighter(0.5)
          .toString(),
        stopOpacity: 0.5,
        offset: "100%"
      }
    ];

    return (
      <div>
        <LiquidFillGauge
          style={{ margin: "0 auto" }}
          width={radius * 2}
          height={radius * 2}
          value={rate}
          percent="%"
          textSize={1}
          textOffsetX={0}
          textOffsetY={0}
          textRenderer={props => {
            const value = Math.round(props.value);
            const radius = Math.min(props.height / 2, props.width / 2);
            const textPixels = (props.textSize * radius) / 2;
            const valueStyle = {
              fontSize: textPixels
            };
            const percentStyle = {
              fontSize: textPixels * 0.6
            };

            return (
              <tspan>
                <tspan className="value" style={valueStyle}>
                  {value}
                </tspan>
                <tspan style={percentStyle}>{props.percent}</tspan>
              </tspan>
            );
          }}
          riseAnimation
          waveAnimation
          waveFrequency={2}
          waveAmplitude={1}
          gradient
          gradientStops={gradientStops}
          circleStyle={{
            fill: fillColor
          }}
          waveStyle={{
            fill: fillColor
          }}
          textStyle={{
            fill: color("#444").toString(),
            fontFamily: "Arial"
          }}
          waveTextStyle={{
            fill: color("#fff").toString(),
            fontFamily: "Arial"
          }}
        />
        <div
          style={{
            margin: "20px auto",
            width: 120
          }}
        >
        </div>
      </div>
    );
  
}

export default MyAttendance;
