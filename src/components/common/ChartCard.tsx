import { Card } from 'antd';
import { Chart } from '@antv/g2';
import { useEffect, useState } from 'react';

const ChatCard = ({
  chartRenderAction,
  title,
  id,
  style,
  data,
}: {
  title?: string;
  id?: string;
  chartRenderAction?: (chart: Chart) => void;
  style?: React.CSSProperties;
}) => {
  const [chart, setChart] = useState<Chart | null>(null);
  const mergedId = id ?? title;

  useEffect(() => {
    console.log('data', data);
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
    <Card title={title} style={style}>
      <div id={mergedId}></div>
    </Card>
  );
};

export default ChatCard;
