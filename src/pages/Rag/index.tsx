import { PageContainer } from '@ant-design/pro-components';
import {  useIntl } from '@umijs/max';
import {  Card, Upload, UploadProps, message } from 'antd';
import React, { useEffect } from 'react';
import { addCoins, addCreator, bindKnowledge, createKnowledge, deleteKnowledge, getKnowledgeList, getRoleDetailById } from '@/services/ant-design-pro/api';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { InboxOutlined } from '@ant-design/icons';
import { FileType } from '../Review/DetailForm';


const { Dragger } = Upload;

const EditRole: React.FC = () => {
  const intl = useIntl();

  const [knowledge, setKnowledge] = React.useState<{
    id: number;
    name: string;
  }[]>([])

  const init = async () => {
    const { data } = await getKnowledgeList()
    setKnowledge(data.data??[])
  }

  useEffect(() => {
    init()
  }, [])
  
  const props: UploadProps = {
    name: 'file',
beforeUpload:(file: FileType) => {
  const isAllowedType = file.type === 'application/pdf' 
    || file.type === 'text/plain' 
    || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    || file.type === 'application/msword';
  if (!isAllowedType) {
    message.error('You can only upload PDF, TXT, DOCX, or DOC file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('File must be smaller than 2MB!');
  }
  return isAllowedType && isLt2M;
},
  multiple: true,
    customRequest: async (data) => {
      console.log(data)
      setKnowledge([
        ...knowledge,
        {
          name: data?.file?.name,
          status:'uploading'
        }
      ])
      await createKnowledge(data.file)
      message.success('上传成功')
      await init()
      return true
    },
    fileList: knowledge?.map((item) => {
      return {
        status: 'done',
        ...item,
        name: item.name,
      }
    }),
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    },
    async onRemove(e) {
      console.log(e)
      await deleteKnowledge(Number(e.id))
      message.success('删除知识库成功')
      await init()
  },
};
  return (
    <PageContainer
      content={intl.formatMessage({
        id: '知识库挂靠角色、知识库文件上传',
      })}
      
    >
      <Card title='知识库挂靠角色'>
        <ProForm<{
      roleId: string;
    }>
          onFinish={async (values) => {
          const res = await bindKnowledge({
            roleId: Number(values.roleId),
            knowledgeId:Number(values.knowledgeId)
          })
            if (res.code === 500) {
                     message.warning(res.message)
              return;
            }
            message.success('操作成功')
      }}
          params={{}}
          layout='horizontal'
    >
      <ProFormText
        width="md"
        name="roleId"
        label="Role ID"
        tooltip="请谨慎操作"
            placeholder="请输入 uid"
            rules={[{ required: true, message: '请输入 uid' }]}
          />
          
             <ProFormSelect
          name="knowledgeId"
          width="md"
          label={'选择知识库'}
            options={knowledge.map(i => {
              return {
                label: i.name,
                value:i.id
            }
          })}
            required
        />
        </ProForm>
        
        
        
      </Card>

      <Card title='上传知识库' style={{
          marginTop: 20
      }}>
        
        <ProForm<{
      uid: string;
      coins: string;
    }>
      //     onFinish={async (values) => {
      //       const res= await addCoins({
      //         uid: values.uid,
      //         coins: Number(values.coins)
      //       })
      //       if (res.code === 500) {
      //         message.warning(res.message)
      //         return;
      //       }
      //       message.success('操作成功')
          // }}
          submitter={
            {
             render:()=>null
            }
          }
          params={{}}
    >
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">点击或拖动到此处上传知识库</p>
    <p className="ant-upload-hint">
上传文件格式：PDF, TXT, DOCX
    </p>
  </Dragger>
        </ProForm>
      </Card>

    </PageContainer>
  );
};

export default EditRole;
