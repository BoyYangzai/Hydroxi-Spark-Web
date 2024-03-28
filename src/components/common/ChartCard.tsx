import { Card } from 'antd';
import { Chart } from '@antv/g2';
import { useEffect, useState } from 'react';


export interface ChartCardProps {
  title?: string;
  id?: string;
  chartRenderAction?: (chart: Chart) => void;
  style?: React.CSSProperties;
  data?: any;
  actionSlot?:React.ReactNode[]
}
const ChatCard = ({
  chartRenderAction,
  title,
  id,
  style,
  data,
  actionSlot
}: ChartCardProps) => {
  const [chart, setChart] = useState<Chart | null>(null);
  const mergedId = id ?? title;

  useEffect(() => {
    if (!chart) {
      const newChart = new Chart({
        container: mergedId,
        autoFit: true,
      });
      setChart(newChart);
      chartRenderAction?.(newChart);
    } else {
      chartRenderAction?.(chart);
    }
  }, [data]);

  return (
    <Card title={title} style={style} extra={actionSlot}>
      <div id={mergedId}></div>
    </Card>
  );
};

export default ChatCard;
