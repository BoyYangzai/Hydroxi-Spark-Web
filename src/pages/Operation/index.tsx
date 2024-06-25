import { PageContainer } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import {  Button, Card, message } from 'antd';
import React, { useEffect } from 'react';
import { addCoins, addCreator, getRoleDetailById, notification } from '@/services/ant-design-pro/api';
import { ProForm, ProFormRadio, ProFormText,ProFormDigit } from '@ant-design/pro-components';

const EditRole: React.FC = () => {
  const intl = useIntl();
  const roleId = window.location.pathname.split('/').pop()
  const [role, setRole] = React.useState({} as any)

  const getRoleDetail = async () => {
    const { data } = await getRoleDetailById({
      roleId:Number(roleId)
    })
    setRole(data)
  }

  useEffect(() => {
    getRoleDetail()
  },[])
  return (
    <PageContainer
      content={intl.formatMessage({
        id: '管理员操作平台',
      })}
  //      extra={[
  //        <Button key="1" type="primary" onClick={() => {
  //          history.back()
  //        }}>
  //          返回
  //   </Button>,
  // ]}
    >
      <Card title='通过 uid 给予用户 Creator 权限'>
        <ProForm<{
      uid: string;
    }>
          onFinish={async (values) => {
          const res = await addCreator({
              uid: values.uid
          })
            if (res.code === 500) {
                     message.warning(res.message)
              return;
            }
            message.success('操作成功')
      }}
          params={{}}
    >
      <ProFormText
        width="md"
        name="uid"
        label="uid"
        tooltip="请谨慎操作"
            placeholder="请输入 uid"
            rules={[{ required: true, message: '请输入 uid' }]}
      />
        </ProForm>
        
        
      </Card>

      <Card title='添加金币' style={{
          marginTop: 20
        }}>
        <ProForm<{
      uid: string;
      coins: string;
    }>
          onFinish={async (values) => {
            const res= await addCoins({
              uid: values.uid,
              coins: Number(values.coins)
            })
            if (res.code === 500) {
              message.warning(res.message)
              return;
            }
            message.success('操作成功')
      }}
          params={{}}
    >
      <ProFormText
        width="md"
        name="uid"
        label="uid"
        tooltip="请谨慎操作"
            placeholder="请输入 uid"
            rules={[{ required: true, message: '请输入 uid' }]}
          />
          
               <ProFormDigit
        width="md"
        name="coins"
        label="金币数"
        tooltip="请谨慎操作"
            placeholder="请输入金币数"
            rules={[{ required: true, message: '请输入金币数' }]}
             fieldProps={{ precision: 0 }}
      />
        </ProForm>
      </Card>

           <Card title='Notification' style={{
          marginTop: 20
        }}>
        <ProForm<{
      uids: string;
      title: string;
      content: string;
    }>
          onFinish={async (values) => {
            const res= await notification({
              uids:values.uids==='all'?undefined: values.uids.split(' '),
              title: values.title,
              content: values.content
            })
            if (res.code === 500) {
              message.warning(res.message)
              return;
            }
            message.success('操作成功')
      }}
          params={{}}
    >
    
          
  <ProFormText
        width="md"
        name="title"
        label="通知标题"
        tooltip="请谨慎操作"
            placeholder="请输入标题"
            rules={[{ required: true, message: '请输入标题' }]}
          />
            <ProFormText
        width="md"
        name="content"
        label="通知内容"
        tooltip="请谨慎操作"
            placeholder="请输入内容"
            rules={[{ required: true, message: '请输入内容' }]}
          />
            <ProFormText
        width="md"
        name="uids"
        label="uids"
        tooltip="请谨慎操作"
        placeholder="请用空格分隔开多个 uid，全部用户请填写 all"
        rules={[{ required: true, message: '请输入 uid' }]}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default EditRole;
