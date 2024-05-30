import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import {  Button, Card, Modal, message } from 'antd';
import React, { useEffect } from 'react';
import { deListReview, getReviewRoleDetail } from '@/services/ant-design-pro/api';
import DetailInfoFrom from './DetailForm';
import { ReviewStatus } from './Review';


const Detail: React.FC = () => {
  const intl = useIntl();
  const roleId = window.location.pathname.split('/').pop()
  const [role, setRole] = React.useState({} as any)

  const getRoleDetail = async () => {
    const { data } = await getReviewRoleDetail(Number(roleId))
    setRole(data)
  }

  useEffect(() => {
    getRoleDetail()
  },[])
  return (
    <PageContainer
      content={intl.formatMessage({
        id: '角色详细信息',
        defaultMessage: '角色详细信息',
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
        <DetailInfoFrom roleData={role}
        onDelete={() => {
                  Modal.confirm({
                    title: '确认下架该角色吗',
                    onOk:async () => {
                      try {
                        await deListReview( role.roleId )
                        message.success('下架角色成功')
                        setRole({ ...role, status: ReviewStatus.DELETED })
                      } catch (error) {
                        message.error('下架角色失败')
                      }
                    },
                  })
                    }}
        />
      </Card>
    </PageContainer>
  );
};

export default Detail;
