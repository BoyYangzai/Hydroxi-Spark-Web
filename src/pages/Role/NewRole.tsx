import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Alert, Button, Card, Typography } from 'antd';
import React from 'react';
import { Space, Table, Tag } from 'antd';
import RoleInfoFrom from '@/components/RoleInfoForm';
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
        id: '请创建角色详细信息',
        defaultMessage: '请创建角色详细信息',
      })}
       extra={[
         <Button key="1" type="primary" onClick={() => {
           history.back()
         }}>
           返回
    </Button>,
  ]}
    >
      <Card>
        <RoleInfoFrom />
      </Card>
    </PageContainer>
  );
};

export default NewRole;
