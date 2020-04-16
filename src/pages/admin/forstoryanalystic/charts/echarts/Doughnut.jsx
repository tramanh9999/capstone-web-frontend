import React from "react";
import ReactEcharts from "echarts-for-react";
import { withStyles } from "@material-ui/styles";

const DoughnutChart = ({ height, color = [], theme, data1=[]}) => {
  const option = {
    legend: {
      show: true,
      itemGap: 20,
      icon: "circle",
      bottom: 0,
      textStyle: {
        // color: theme.palette.text.secondary,
        color: "#03a9f4",
        fontSize: 13,
        fontFamily: "roboto"
      }
    },
    tooltip: {
      show: false,
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    xAxis: [
      {
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],

    series: [
      {
        name: "Traffic Rate",
        type: "pie",
        radius: ["45%", "72.55%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        hoverOffset: 5,
        stillShowZeroSum: false,
        label: {
          normal: {
            show: false,
            position: "center", // shows the description data to center, turn off to show in right side
            textStyle: {
              // color: theme.palette.text.secondary,
              color: "#03a9f4",
              fontSize: 13,
              fontFamily: "roboto"
            },
            formatter: "{a}"
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: "14",
              fontWeight: "normal"
              // color: "rgba(15, 21, 77, 1)"
            },
            formatter: "{b} \n{c} ({d}%)"
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: data1,
       
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      },
    ]
  };
  // voi cai nay


  //donut cycle chart option dung option datao nhung co ve lay gia tri khac de update thoi chu khong overide
  // option nay co 
  console.log("du lieu rating donut char:");
  console.log(data1);
console.log({option});

  return (
    <ReactEcharts
      style={{ height: height }}
      option={{
        ...option,
        color: [...color],

      }}
    />
  );
};

export default withStyles({}, { withTheme: true })(DoughnutChart);
