import { PageContainer, ProForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  GetDataScreenDataByUrl,
} from '@/services/ant-design-pro/api';
import { DatePicker } from 'antd';
import type { TimeRangePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import LineChartCard, { LineChartData } from '@/components/Chart/LineChartCard';

enum TimeUnits {
  day = "day",
  month = "month",
  year = "year",
}

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
];

const transformLineChartDataToG2 = (lineData:LineChartData) => {
  const transformLineData = lineData?.data?.map((i) => {
      return {
        [lineData?.xKey]: i.xValue,
        [lineData?.yKey]: i.yValue,
        field: i.field,
      };
      });
  return transformLineData
}

enum ActivityType{
  'day' = 0,
   'month' = 1
}

interface PresetLineChartCard {
     [key:string]:{
      title?: string;
      requestUrl?: any;
      extraPayload?: {
        [key: string]: any;
      },
      hasField?:0|1
    } 
}
const EditRole: React.FC = () => {
  const intl = useIntl();
  const [loading,setLoading] = useState<boolean>(false)
  const [timeUnit, setTimeUnit] = useState<TimeUnits>(TimeUnits.day);
  const [timeRange, setTimeRange] = useState<{
    beginTime: string;
    endTime: string;
  }>({
    beginTime: dayjs().add(-7, 'd').format('YYYY-MM-DD'),
    endTime: dayjs().format('YYYY-MM-DD'),
  });

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

  // render chart
 
  const [lineChartData, setLineChartData] = useState<PresetLineChartCard&LineChartData | PresetLineChartCard>({
    nu: {
      title: '新增用户数',
      requestUrl: '/api/admin/platform/nu',
      hasField:0
    },
    uv: {
      title: '每日独立访客',
      requestUrl: '/api/admin/platform/uv',
      hasField:0
    },
    au: {
      title: '活跃用户数',
      requestUrl: '/api/admin/platform/au',
      extraPayload: {
        activityType:ActivityType.day
      },
      hasField:0
      
    },
    rr: {
      title: '新用户留存',
      requestUrl: '/api/admin/platform/rr',
      hasField:0
    }
  });

  const fetchChartData = async () => {
    const postPayload = {
       ...timeRange,
      ...formRef.current?.getFieldsValue(),
    };
    const allChartData = await Promise.all(Object.keys(lineChartData).map(key => {
      const lineChartItem=lineChartData[key]
      return GetDataScreenDataByUrl({
        url: lineChartItem.requestUrl,
        ...lineChartItem?.extraPayload,
        ...postPayload
      });
    }))

    allChartData?.forEach((i,index) => {
      const lineData = i?.data
      const signalKey = Object.keys(lineChartData)?.[index]
      const transformLineData = transformLineChartDataToG2(lineData)
      //@ts-ignore
    setLineChartData(prevState => ({
       ...prevState,
       [signalKey]: {
         ...prevState[signalKey],
         ...lineData,
         data: transformLineData,
       }
      }));
    })
  };

  const handleSubmit = async () => {
    setLoading(true)
    await fetchChartData();
    setLoading(false)
  };

  useEffect(() => {
    handleSubmit()
  },[])


  return (
    <ProForm
      formRef={formRef}
      submitter={false}
    >
       <PageContainer
      content={intl.formatMessage({
        id: 'App内新增用户留存数据',
        defaultMessage: 'App内新增用户留存数据',
      })}
      extra={
        <>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            查询
          </Button>
          <ProFormSelect
            width={160}
            options={Array.from(Object.values(TimeUnits)).map((i) => {
              return { label: i, value: i };
              })
            }
            placeholder={'请选择时间单位'}
            name="timeUnit"
            onChange={async (value) => {
                setTimeUnit(value);
            }}
            noStyle
            />
          <RangePicker
            presets={timeUnit === TimeUnits.day ? rangePresets : []}
            onChange={onRangeChange}
            defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
            picker={timeUnit}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {
            Object.keys(lineChartData).map((key, index) => {
              const chartData = lineChartData[key];
              return (
                <LineChartCard
                  key={index}
                  style={{
                    width: '49%',
                    marginTop: 20,
                  }}
                  title={chartData.title}
                  id={`${key}Line`}
                  lineChartData={lineChartData[key]}
                />
              );
            }
            )
         }
        </div>
      </>
    </PageContainer>
    </ProForm>
  );
};

export default EditRole;
