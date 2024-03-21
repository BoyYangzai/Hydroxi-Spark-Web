import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Alert, Button, Card, Pagination, Typography } from 'antd';
import React, { useEffect } from 'react';
import { Space, Table, Tag } from 'antd';
import { getRoleList } from '@/services/ant-design-pro/api';

const { Column, ColumnGroup } = Table;

interface DataType {
  roleName: string;
  roleId: number;
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

const Admin: React.FC = () => {
  const intl = useIntl();

  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [roleList, setRoleList] = React.useState<DataType[]>([]);

  const fetchData = async () => {
    const { data } = await getRoleList({ current: currentPage, pageSize: 10 });
    setTotal(data.total);
    setRoleList(data.roles);
  }

  useEffect(() => {
    fetchData();
  }, [currentPage])
  
  return (
    <PageContainer
      content={intl.formatMessage({
        id: '现有角色的性格，人物背景，年龄, 关系值等信息',
        defaultMessage: '现有角色的性格，人物背景，年龄, 关系值等信息',
      })}
       extra={[
         <Button key="1" type="primary" onClick={() => {
           history.push('/role/new_role')
         }}>
           新增角色
    </Button>,
  ]}
    >
      <Card
      >
    <Table dataSource={roleList} pagination={{
          total,
          current: currentPage,
          onChange: (page) => {
            setCurrentPage(page);
          }
        }}>
    <Column title="ID" dataIndex="roleId" key="id" width={'5%'} />
    <Column title="Name" dataIndex="roleName" key="roleName" width={'70%'} />
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
                <Button type='primary' onClick={() => {
                  history.push(`/role/edit/${record.roleId}`)
                }}>编辑</Button>
              </div>
              
      )}
    />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Admin;
