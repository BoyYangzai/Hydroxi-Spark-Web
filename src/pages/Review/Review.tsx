import { CheckCircleOutlined, CloseCircleOutlined, HeartTwoTone, SmileFilled, SmileTwoTone, WarningOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Alert, Button, Card, Modal, Pagination, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { approveReview, deListReview, deleteRoleById, getCustomRoleLogByRoleId, getLogByRoleId, getReviewList, getRoleList } from '@/services/ant-design-pro/api';

const { Column } = Table;

enum ReviewStatus {
  WAIT_REVIEW = 0,
  REVIEWED = 1,
  NOT_APPROVED = 2,
  DELETED = 3
}
interface DataType {
  roleName: string;
  roleId: string;
  createUid: string;
  reviewStatus: ReviewStatus
}



const Admin: React.FC = () => {
  const intl = useIntl();

  const [mainTotal, setMainTotal] = React.useState(0);
  const [mainTableCurrentOffset, setMainTableCurrentOffset] = React.useState(0);
  const [roleList, setRoleList] = React.useState<DataType[]>([]);
  const fetchData = async () => {
    const { data } = await getReviewList({ offset: mainTableCurrentOffset, limit: 10 });
    setMainTotal(data.total);
    setRoleList(data.data);
  }

  useEffect(() => {
    fetchData();
  }, [mainTableCurrentOffset])
  

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
  const [logTableCurrentOffset, setLogTableCurrentOffset] = React.useState(0);
  const fetchLogData = async (roleId?: number) => {
    if (!roleId) return;
    const { data } = await getCustomRoleLogByRoleId({
      roleId,
      startTime: '2021-01-01',
      endTime: '2025-01-01'
    })
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
    if(isModalOpen){
      fetchLogData(roleLogSelected?.roleId)
    }
  }, [logTableCurrentOffset,isModalOpen])


  const clearState = () => {
    setIsModalOpen(false);
    setLogTableCurrentOffset(0)
    setLogTotal(0)
    setLogModalData([])
  }
  const handleOk = () => {
    setIsModalOpen(false);
    clearState()
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    clearState()
  };
  return (
    <PageContainer
      content={intl.formatMessage({
        id: '平台创作者生产角色的审核，购买情况',
        defaultMessage: '平台创作者生产角色的审核，购买情况',
      })}
       extra={[
         <Button key="1" type="primary" onClick={() => {
           history.push('/role/new_role')
         }}>
           新增角色
    </Button>,
  ]}
>
<Card>
   <Modal title={`${roleLogSelected?.roleName} 流水单`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} 
          footer={
           (_, { OkBtn }) => (
                <>
                  <OkBtn />
                </>
              )
        }
        >
      <Table 
          size='small'
         dataSource={logModalData} 
         pagination={{
          total: logTotal,
          current: logTableCurrentOffset===0?1:(logTableCurrentOffset/10)+1,
           onChange: (page) => {
              setLogTableCurrentOffset((page-1)*10);
            }
          }}
          >
            <Column title="操作类型" key="operateType" width={'30%'}
              dataIndex={'operateType'}
              render={
              (_, { operateType }: {
                operateType: string
              }) => (
                <span style={{
                  color: operateType === '删除角色' ? 'red' : undefined,
                  height:'100%'
                }}>{ operateType}</span>
              )
             }/>
            <Column title="操作者" dataIndex='operatorName' key="operatorName" width={'20%'}
              render={(_, record: {
                operateType: string
                operatorName: string
              }) => (
                <span style={{
                  color: record?.operateType === '删除角色' ? 'red' : undefined,
                  height:'100%'
                }}>{record?.operatorName}</span>
              )}
            />
            <Column title="操作时间" key="updatedTime" width={'50%'}
              render={(_,  record: {
                operateType: string
                updatedTime: string
              }) => (
                <span style={{
                  color: record?.operateType === '删除角色' ? 'red' : undefined,
                  height:'100%'
                }}>{record?.updatedTime}</span>
              )}
            />
      </Table>
  </Modal>
  <Table dataSource={roleList} pagination={{
          total: mainTotal,
         current: mainTableCurrentOffset===0?1:(mainTableCurrentOffset/10)+1,
           onChange: (page) => {
              setMainTableCurrentOffset((page-1)*10);
            }
        }}>
    <Column title="ID" dataIndex="roleId" key="id" width={'5%'} />
          <Column title="Name" dataIndex="roleName" key="roleName" width={'10%'} />
    <Column title="Creator uid" dataIndex="createUid" key="createUid" width={'10%'} />
          
    <Column title="审核状态" key="reviewStatus" dataIndex={'reviewStatus'} width={'10%'}
            render={(reviewStatus) => {
              switch (reviewStatus) {
                case ReviewStatus.WAIT_REVIEW:
                  return <Tag icon={<WarningOutlined />} color="warning">待审核</Tag>
                case ReviewStatus.REVIEWED:
                  return <Tag icon={<CheckCircleOutlined />} color="success">已审核</Tag>
                case ReviewStatus.NOT_APPROVED:
                  return <Tag icon={<CloseCircleOutlined />} color="error">未通过</Tag>
                case ReviewStatus.DELETED:
                  return <Tag icon={<CloseCircleOutlined />} color="error">已下架</Tag>
                default:
                  return <Tag icon={<SmileTwoTone />} color="processing">待审核</Tag>
              }
            }}
    />
    <Column
      title="Action"
            key="action"
            width={'20%'}
            align='center'
            render={(_: any, record: DataType) => {
              return (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Button onClick={() => {
                  showModal(record.roleId,record.roleName)
                }}>流水</Button>
        
                <Button onClick={() => {
                  history.push(`/review/${record.roleId}`)
                }}>查看</Button>
                        <Button
                  onClick={() => {
                  Modal.confirm({
                    title: '确认下架该角色吗',
                    content:   <div>
                      {
                      `roleId：${record.roleId} --- roleName：${record.roleName} `
                      }
                    </div>,
                    onOk:async () => {
                      try {
                        await deListReview( record.roleId )
                        message.success('下架角色成功')
                        const recordIndex = roleList.findIndex((item) => item.roleId === record.roleId)
                        const newRoleList = [...roleList]
                        newRoleList[recordIndex] = {
                          ...newRoleList[recordIndex],
                          reviewStatus: ReviewStatus.DELETED
                        }
                        setRoleList(newRoleList)
                      } catch (error) {
                        message.error('下架角色失败')
                      }
                    }
                  })
                 }}>下架</Button>
                <Button type='primary' disabled={record.reviewStatus !== ReviewStatus.WAIT_REVIEW}
                  onClick={async () => {
                    await approveReview(record.roleId)
                    message.success('审核通过')
                    fetchData()
                }}
                >通过</Button>
              </div>
      )
            }}
    />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Admin;
