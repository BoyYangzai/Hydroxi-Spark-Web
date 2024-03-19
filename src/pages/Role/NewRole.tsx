import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Alert, Button, Card, Typography } from 'antd';
import React from 'react';
import { Space, Table, Tag } from 'antd';

const { Column, ColumnGroup } = Table;

interface DataType {
  name: string;
}

const data: DataType[] = [
  {
    name: 'Brown',
  },
  {
    name: 'Green',
  },
  {
    name: 'Black',
  },
];

const NewRole: React.FC = () => {
  const intl = useIntl();
  return (
    <PageContainer
      content={intl.formatMessage({
        id: '现有角色的性格，人物背景，年龄, 关系值等信息',
        defaultMessage: '现有角色的性格，人物背景，年龄, 关系值等信息',
      })}
       extra={[
         <Button key="1" type="primary" onClick={() => {
           history.back()
         }}>
           返回
    </Button>,
  ]}
    >
      <Card
      >
   <Table dataSource={data}>
    <Column title="Name" dataIndex="name" key="name" width={'75%'} />
    <Column
      title="Action"
      key="action"
            render={(_: any, record: DataType) => (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Button>操作日志</Button>
                 <Button>删除</Button>
                <Button type='primary'>编辑</Button>
              </div>
              
      )}
    />
  </Table>
      </Card>
    </PageContainer>
  );
};

export default NewRole;
