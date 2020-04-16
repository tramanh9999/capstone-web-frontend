import React from "react";
import ReactEcharts from "echarts-for-react";
import { merge } from "lodash";

const defaultOption = {
  backgroundColor: "rgb(51, 51, 51)",

  grid: {
    top: 16,
    left: 36,
    right: 16,
    bottom: 32,
    show: true,
    backgroundColor: "rgb(51, 51, 51)",
  },
  // lineStyle:{color: "rgb(221, 107, 102)"},
  legend: { 
    backgroundColor: "rgb(51, 51, 51)",
    textStyle: { color: "#fff" },
    height: "50px",
    top: "20px",
    data:['Lượt xem','Bình luận','Click vào link','Hoàn thành']   },
  tooltip: {
    show: true,
    trigger: "axis",

    axisPointer: {
      type: "cross",
      lineStyle: {
        opacity: 0,
      },
    },
    crossStyle: {
      //color cua -0- va chon ngay
      color: "#FFFFFF",
    },
  },
  series: [
    {
      areaStyle: {},
      smooth: true,
      lineStyle: {
        width: 3,
        // color: "rgb(221, 107, 102)",
      },
      
    },
  ],
  xAxis: {
    show: true,
    type: "category",
    showGrid: false,
    boundaryGap: false,
    axisLabel: {
      color: "#FFFFFF",
      margin: 20,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    // min: 10,
    min: 0,
    // max: 60,
    axisLabel: {
      color: "#ccc",
      // margin: 20,
      fontSize: 13,
      fontFamily: "roboto",
      padding: 10,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "rgba(255, 255, 255, .1)",
      },
    },

    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  color: [
    {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: "rgba(255,255,255,.1)", // color at 0% position
        },
        {
          offset: 1,
          color: "rgba(255,255,255,0.5)", // color at 100% position
        },
      ],
      global: false, // false by default
    }
  ],
};

const ModifiedAreaChart = ({ height, option }) => {
  return (
    <ReactEcharts
      style={{ height: height }}
      option={merge({}, defaultOption, option)}
    />
  );
};

export default ModifiedAreaChart;
