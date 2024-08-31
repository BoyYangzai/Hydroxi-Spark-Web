import { CheckCircleOutlined, CloseCircleOutlined, HeartTwoTone, SmileFilled, SmileTwoTone, WarningOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Button, Card, Modal, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { approveReview, deListReview, getCustomRoleLogByRoleId, getReviewList } from '@/services/ant-design-pro/api';
import BillList from './BillList';

const { Column } = Table;

export enum ReviewStatus {
  WAIT_REVIEW = 0,
  REVIEWED = 1,
  NOT_APPROVED = 2,
  DELETED = 3
}
interface DataType {
  roleName: string;
  roleId: string;
  createUid: string;
  reviewStatus: ReviewStatus;
  lang: string[];
}



const Admin: React.FC = () => {
  const intl = useIntl();

  const [mainTotal, setMainTotal] = React.useState(0);
  const [mainTableCurrentOffset, setMainTableCurrentOffset] = React.useState(0);
  const [roleList, setRoleList] = React.useState<DataType[]>([]);
  const fetchData = async () => {
    const { data } = await getReviewList({ offset: mainTableCurrentOffset, limit: 10 });
    console.log(data) 
    setMainTotal(data.count);
    setRoleList(data.data);
  }

  useEffect(() => {
    fetchData();
  }, [mainTableCurrentOffset])
  

  // Log Modal
  const [roleLogSelected, setRoleLogSelected] = useState<DataType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [zone, setZone] = useState<string[]>([])

  const options = [
  { value: 'en', label: '美国' },
    { value: 'ja', label: '日本' },
  ]
  const handleChange = async () => {
    await approveReview(roleLogSelected?.roleId ?? '', zone)
    message.success('修改成功')
    await fetchData()
    setIsZoneModalOpen(false)

};
  return (
    <PageContainer
      content={intl.formatMessage({
        id: '平台创作者生产角色的审核，购买情况',
        defaultMessage: '平台创作者生产角色的审核，购买情况',
      })}
>
<Card>
        <BillList roleId={roleLogSelected?.roleId ?? ''} roleName={roleLogSelected?.roleName ?? ''} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <Modal open={isZoneModalOpen} title='地区选择' onCancel={() => {
          setIsZoneModalOpen(false)
        }}
          onOk={handleChange}
        >
         <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="选择地区"
            options={options}
            defaultValue={zone}
            onChange={(value) => {
              setZone(value)
            }}
            
          />
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
                  <Button
                    disabled={record.reviewStatus !== ReviewStatus.REVIEWED}
                    onClick={() => {
                    setRoleLogSelected(record)
                    setZone(record.lang)
                      setIsZoneModalOpen(true)
                      
                  }}>{record.lang}</Button>
                  <Button onClick={() => {
                    setRoleLogSelected(record)
                    setIsModalOpen(true)
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
                    }}
                    disabled={record.reviewStatus !== ReviewStatus.REVIEWED}
                  >下架</Button>
                <Button type='primary' disabled={record.reviewStatus === ReviewStatus.REVIEWED}
                  onClick={async () => {
                    await approveReview(record.roleId,record.lang)
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
