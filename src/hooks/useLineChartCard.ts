import { LineChartData } from "@/components/Chart/LineChartCard";

const useLineChartCard = ({
  lineChartData
}: {
  lineChartData?: LineChartData
}) => {
  const renderLineChart = (chart) => {
    const resLineData = lineChartData?.hasField == 0 ? lineChartData?.data?.map(i => {
      return {
        ...i,
        field: '全部',
      }
    }) : lineChartData?.data;

    chart
      .data(resLineData)
      .encode('x', lineChartData?.xKey)
      .encode('y', lineChartData?.yKey)
      .encode('color', 'field')
      .scale('x', {
        range: [0, 1],
      })
      .scale('y', {
        nice: true,
      })
      .axis('y', { labelFormatter: (d) => d });


    chart.line().encode('shape', 'smooth');
    chart.point().encode('shape', 'point').tooltip(false);
    chart.render();
  };


  return { renderLineChart }

}


export { useLineChartCard }
