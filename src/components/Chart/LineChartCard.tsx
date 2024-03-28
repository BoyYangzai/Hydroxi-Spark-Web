import { useLineChartCard } from "@/hooks/useLineChartCard";
import ChatCard, { ChartCardProps } from "../common/ChartCard";

export interface  LineChartData {
  data: {
    xValue: string;
    yValue: number;
    field?: string;
  }[];
  xKey: string;
  yKey: string;
  hasField?: 0|1;
  }
const LineChartCard = ({ ...props }: ChartCardProps & {
  lineChartData?: LineChartData;
}) => {
  const {renderLineChart}=useLineChartCard({lineChartData:props.lineChartData});
  return   <ChatCard
            style={{
              width: '46%',
            }}
            title="角色Talk点击数"
            chartRenderAction={renderLineChart}
            id="角色Talk点击数Line"
            data={props?.lineChartData}
           {...props}
          />
}

export default LineChartCard;
