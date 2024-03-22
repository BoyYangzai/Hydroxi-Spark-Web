import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Alert, Button, Card, Modal, Pagination, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { deleteRoleById, getLogByRoleId, getRoleList } from '@/services/ant-design-pro/api';

const { Column, ColumnGroup } = Table;

interface DataType {
  roleName: string;
  roleId: number;
}

const Admin: React.FC = () => {
  const intl = useIntl();

  const [mainTotal, setMainTotal] = React.useState(0);
  const [mainTableCurrentPage, setMainTableCurrentPage] = React.useState(1);
  const [roleList, setRoleList] = React.useState<DataType[]>([]);

  const fetchData = async () => {
    const { data } = await getRoleList({ offset: mainTableCurrentPage, limit: 10 });
    setMainTotal(data.total);
    setRoleList(data.roles);
  }

  useEffect(() => {
    fetchData();
  }, [mainTableCurrentPage])
  

  // Log Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleLogSelected, setRoleLogSelected] = useState<DataType | null>(null);
  const [logModalData,setLogModalData] = useState<
        {
        operateType: string,
        operatorName: string,
        updatedTime:string,
    }[]>([])
  const [logTotal, setLogTotal] = React.useState(0);
  const [logTableCurrentPage, setLogTableCurrentPage] = React.useState(1);
  const fetchLogData = async (roleId?: number) => {
    if (!roleId) return;
    const {data} = await getLogByRoleId({ roleId, offset: logTableCurrentPage, limit: 10 })
    setLogTotal(data.total) 
    setLogModalData(data.logs)
  }
  const showModal = async (roleId:number,roleName:string) => {
    setIsModalOpen(true);
    setRoleLogSelected({
      roleId,
      roleName
    })
    await fetchLogData(roleId)
  };

  useEffect(() => {
     fetchLogData(roleLogSelected?.roleId)
  }, [logTableCurrentPage])

  const handleOk = () => {
    setIsModalOpen(false);
    setLogTableCurrentPage(1)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
        <Modal title={`${roleLogSelected?.roleName} 操作日志`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} 
          footer={
           (_, { OkBtn }) => (
                <>
                  <OkBtn />
                </>
              )
        }
        >
         <Table dataSource={logModalData} pagination={{
          total: logTotal,
          current: logTableCurrentPage,
            onChange: (page) => {
            console.log('page',page)
            setLogTableCurrentPage(page);
            }
          }}>
    <Column title="操作类型" dataIndex="operateType" key="operateType" width={'5%'} />
    <Column title="操作者" dataIndex="operatorName" key="operatorName" width={'5%'} />
    <Column title="操作时间" dataIndex="updatedTime" key="updatedTime" width={'5%'} />
          </Table>
      </Modal>
    <Table dataSource={roleList} pagination={{
          total: mainTotal,
          current: mainTableCurrentPage,
          onChange: (page) => {
            setMainTableCurrentPage(page);
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
                <Button onClick={() => {
                  showModal(record.roleId,record.roleName)
                }}>操作日志</Button>
                <Button onClick={() => {
                  Modal.confirm({
                    title: '确认删除该角色吗',
                    content:   <div>
                      {
                      `roleId：${record.roleId} --- roleName：${record.roleName} `
                      }
                      <div>
                         角色的所有数据将会被删除，且无法找回
                      </div>
                    </div>,
                    onOk:async () => {
                      try {
                        await deleteRoleById({ roleId: record.roleId })
                        message.success('删除角色成功')
                        fetchData()
                      } catch (error) {
                        message.error('删除角色失败')
                      }
                    }
                  })
                 }}>删除</Button>
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
