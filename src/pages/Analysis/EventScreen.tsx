import { PageContainer, ProForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  getEventLineChartData,
  getEventOrFieldList,
  getEventPieChartData,
} from '@/services/ant-design-pro/api';
import { DatePicker } from 'antd';
import type { TimeRangePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import ChatCard from '@/components/common/ChartCard';
import { LineChartData } from '@/components/Chart/LineChartCard';

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
];


const EditRole: React.FC = () => {
  const intl = useIntl();
  const [eventOptions, setEventOptions] = useState<[]>([]);
  const [fieldOptions, setFieldOptions] = useState<[]>([]);
  const [currentSelectedEventId, setCurrentSelectedEventId] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<{
    beginTime: string;
    endTime: string;
  }>({
    beginTime: dayjs().add(-7, 'd').format('YYYY-MM-DD'),
    endTime: dayjs().format('YYYY-MM-DD'),
  });
const [submitBtnText,setSubmitBtnText]=useState<string>('查询')

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      setTimeRange({
        beginTime: dateStrings[0],
        endTime: dateStrings[1],
      });
    } else {
      console.log('Clear');
    }
  };
  const formRef = useRef<
    ProFormInstance<{
      name: string;
      company?: string;
      useMode?: string;
    }>
  >();

  const fetchListByType = async ({ isEventField }: { isEventField: boolean }) => {
    if (isEventField) {
      setSubmitLoading(true)
      setSubmitBtnText('获取变量列表中...')
    }
    const { data } = await getEventOrFieldList({
      eventName: isEventField ? currentSelectedEventId : '',
    });
    const resData = isEventField
      ? data?.data?.map((i) => {
          return { label: i.field, value: i.field };
        })
      : data?.data?.map((i) => {
          return { label: i.event, value: i.event };
        });
    if (isEventField) {
      formRef.current?.setFieldsValue({ fieldName: resData?.[0]?.value ?? '' });
      setFieldOptions(resData);
    } else {
      setEventOptions(resData);
    }
  };

  useEffect(() => {
    setSubmitLoading(false)
    setSubmitBtnText('查询')
  }, [fieldOptions])
  
  useEffect(() => {
    fetchListByType({ isEventField: false });
  }, []);

  useEffect(() => {
    if (currentSelectedEventId) {
      fetchListByType({ isEventField: true });
    }
  }, [currentSelectedEventId]);

  // render chart
  const [lineChartData, setLineChartData] = useState<LineChartData>({
    xKey: 'x',
    yKey: 'y',
    data:[]
  });
  const [pieChartData, setPieChartData] = useState([]);

  const fetchChartData = async () => {
    const postPayload = {
      ...timeRange,
      ...formRef.current?.getFieldsValue(),
    };

    const { data: lineData } = await getEventLineChartData(postPayload);
    const { data: pieData } = await getEventPieChartData(postPayload);

    const transformLineData = lineData?.data?.map((i) => {
      return {
        [lineData?.xKey]: i.xValue,
        [lineData?.yKey]: i.yValue,
        field: i.field,
      };
    });
    setLineChartData({
      ...lineData,
      data: transformLineData,
    });

    console.log('pieData', pieData);
    setPieChartData(pieData?.data);
  };

  const renderLineChart = (chart) => {
    const resLineData = lineChartData?.hasField==0 ? lineChartData?.data?.map(i => {
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

  const renderPieChart = (chart) => {
    const hasFiled = pieChartData?.length==1&&pieChartData?.[0].percent==1 
    const resPieData =pieChartData?.map(i => {
      return {
        ...i,
        item:hasFiled ? '全部': i.item,
        percent: Number(i.percent),
      }
     }
    );
    console.log('resPieData', resPieData);
    chart.coordinate({ type: 'theta', outerRadius: 0.8 });
    chart
      .interval()
      .data(resPieData)
      .transform({ type: 'stackY' })
      .encode('y', 'percent')
      .encode('color', 'item')
      .legend('color', { position: 'bottom', layout: { justifyContent: 'center' } })
      .label({
        position: 'outside',
        text: (data) => `${data.item}: ${data.percent * 100}%`,
      })
      .tooltip((data) => ({
        name: data.item,
        value: `${data.percent * 100}%`,
      }));

    chart.render();
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    await fetchChartData();
    setSubmitLoading(false);
  };

  return (
    <PageContainer
      content={intl.formatMessage({
        id: 'App内功能的点击数据',
        defaultMessage: 'App内功能的点击数据',
      })}
      extra={
        <>
          <Button type="primary" onClick={handleSubmit} loading={submitLoading} disabled={!currentSelectedEventId}>
            {submitBtnText}
          </Button>
          <RangePicker
            presets={rangePresets}
            onChange={onRangeChange}
            defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
          />
        </>
      }
      header={{
        style: {
          backgroundColor: 'white',
        },
      }}
    >
      <>
        <ProForm<{
          eventName?: string;
          fieldName?: string;
        }>
          formRef={formRef}
          params={{ id: '100' }}
          formKey="base-form-use-demo"
          dateFormatter={(value, valueType) => {
            console.log('---->', value, valueType);
            return value.format('YYYY/MM/DD HH:mm:ss');
          }}
          autoFocusFirstInput
          submitter={false}
          layout={'vertical'}
        >
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <ProFormSelect
              width={550}
              options={eventOptions}
              name="eventName"
              label="查询事件"
              onChange={async (value) => {
                setCurrentSelectedEventId(value);
              }}
            />
            <ProFormSelect width={550} options={fieldOptions} name="fieldName" label="查询变量" />
          </div>
        </ProForm>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ChatCard
            style={{
              width: '46%',
            }}
            title="角色Talk点击数"
            chartRenderAction={renderLineChart}
            id="角色Talk点击数Line"
            data={lineChartData}
          />
          <ChatCard
            style={{
              width: '46%',
            }}
            title="角色Talk点击数"
            chartRenderAction={renderPieChart}
            id="角色Talk点击数Pie"
            data={pieChartData}
          />
        </div>
      </>
    </PageContainer>
  );
};

export default EditRole;
