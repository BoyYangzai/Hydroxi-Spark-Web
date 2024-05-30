import {  Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import {  getCustomRoleLogByRoleId } from '@/services/ant-design-pro/api';

export default function BillList({ roleId, roleName,
  isModalOpen, setIsModalOpen
}: {
  roleId: string;
  roleName: string;
  isModalOpen: boolean;
  setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>
}) {
    // Log Modal
  const [logModalData,setLogModalData] = useState<
        {
          totalCoins: number,
      billList: {
        month: string,
        totalCoins: number,
        details: {
          coins: string,
          transactionTime: string,
        }[]
      }[]
    }>({
      totalCoins: 0,
      billList: [{
        month: '',
        totalCoins: 0,
        details: [{
          coins: '',
          transactionTime: '',
        }]
      }]
    })
  console.log(logModalData)
  const fetchLogData = async (roleId?: number) => {
    if (!roleId) return;
    const { data } = await getCustomRoleLogByRoleId({
      roleId,
      startTime: '2021-01-01',
      endTime: '2025-01-01'
    })
    setLogModalData(data)
  }

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }
  useEffect(() => {
    if(isModalOpen){
      fetchLogData(roleId)
    }
  }, [isModalOpen])
  
  return (
    <Modal title={<div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <div>
      {roleName} 流水单
      </div>
      <div>
        Income: {logModalData?.totalCoins} coin 
      </div>
    
     </div>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} 
          footer={
           (_, { OkBtn }) => (
             <div style={{
               width: '100%',
               display: 'flex',
                justifyContent: 'center',
                }}>
                  <OkBtn />
                </div>
              )
        }
        >
      
      <div style={{
        overflowY: 'scroll',
        maxHeight: '400px',
        width: '100%',  
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',

        }}>
        {
          logModalData?.billList?.map((item,index) => (
            <div key={index}
            style={{
      width: '100%',
      display: 'flex',
              justifyContent: 'space-between',
                      flexWrap: 'wrap',
      
              }}>
              <span style={{
                fontWeight: 'bold'
              }}>
              {item.month}
              </span>
              <div>
                Total: <span style={{
                  color: '#1890ff',
                  fontWeight: 'bold'
                }}>
                  {item.totalCoins??item?.totalCons} coin
                </span>
              </div>
              {
                item.details?.map((detail,index) => (
                  <div key={index}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                    }}>
                    <div>
                      <span style={{
                        color: '#1890ff',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}.
                      </span>{'  '}
                      {detail.transactionTime}
                    </div>
                    <div>
                      +{detail.coins} coin
                    </div>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
  </Modal>
  )
}
