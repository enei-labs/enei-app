import { Box, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import dynamic from "next/dynamic";
import { TransferDegree } from "@core/graphql/types";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options = {
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any) {
      return val.toFixed(1) + "%";
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#304758"],
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    // position: "top",
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  yaxis: {
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: true,
      formatter: function (val: any) {
        return val.toFixed(1) + "%";
      },
    },
  },
  // title: {
  //   text: "Monthly Inflation in Argentina, 2002",
  //   floating: true,
  //   offsetY: 330,
  //   align: "center",
  //   style: {
  //     color: "#444",
  //   },
  // },
};

const styles = {
  container: {},
  flex: {
    display: "flex",
    justifyContent: "space-between",
  },
} as const;

interface DemoChartProps {
  name: string;
  thisYearTransferRecords: TransferDegree[];
}

export function mapDegreesByMonth(transferDegrees: TransferDegree[]): number[] {
  const monthlyDegrees: number[] = new Array(12).fill(0);

  transferDegrees.forEach((transferDegree: TransferDegree) => {
    const createdAt = new Date(transferDegree.createdAt);
    const month = createdAt.getMonth(); // 0-11，0 表示一月份，11 表示十二月份
    monthlyDegrees[month] = monthlyDegrees[month] + transferDegree.degree;
  });

  return monthlyDegrees;
}

export default function UserTransferDegreeChart(props: DemoChartProps) {
  const [value, setValue] = useState();
  const { name, thisYearTransferRecords } = props;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.flex}>
        <Typography variant="h5">{name}</Typography>
        <DatePicker
          views={["year"]}
          label="Year only"
          value={value}
          onChange={(newValue: any) => {
            setValue(newValue);
          }}
          slots={(params: any) => <TextField {...params} helperText={null} />}
        />
      </Box>
      <Chart
        series={[
          {
            name: "Inflation",
            data: mapDegreesByMonth(thisYearTransferRecords),
          },
        ]}
        options={options}
        type="bar"
        height="400px"
        width="100%"
      />
    </Box>
  );
}
