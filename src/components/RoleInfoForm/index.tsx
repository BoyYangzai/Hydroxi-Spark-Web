import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormCascader,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormDigitRange,
  ProFormGroup,
  ProFormList,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProFormUploadButton,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { Avatar, TreeSelect, Upload, message } from 'antd';
import moment from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import type { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import RelationshipItem from './RelationshipItem';
import { getVoiceList, saveRoleDetail } from '@/services/ant-design-pro/api';

interface RelationshipInfo{
   intimacyInfoLevel: number;
   relationPrompt: string;
   roleShows: string[];
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const RoleInfoFrom = ({ roleData }) => {
  const formRef = useRef<
    ProFormInstance<{
      name: string;
    }>
    >();

  const [maxRelationship,setMaxRelationship] = useState(3)

  // Upload
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleAvatarUploadChange: UploadProps['onChange'] = (info) => {
    if (!beforeUpload(info.file as FileType)) 
    {
       return;
    }
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

   const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
   );
  
  // get voice list
  const [voiceList, setVoiceList] = useState([]) 
  const getAllVoice = async () => {
    const { data } = await getVoiceList()
    const dataVoiceList = data?.voices?.map(i => {
      return {
        label: i,
        value: i
      }
    })
    setVoiceList(dataVoiceList)
  }
  // set form data
  
  const [roleShowsInfos, setRoleShowsInfos] = useState<RelationshipInfo[]>([])
  useEffect(() => {
    setImageUrl(roleData?.avatar)
    formRef.current?.setFieldsValue({
      ...roleData,
      ...roleData?.roleShowInfos?.map((item) => {
        return {
          [`intimacyInfoLevel${item?.intimacyInfoLevel}`]: item?.relationPrompt
        }
      }).reduce((result, currentObject) => {
          return { ...result, ...currentObject };
      }, {})
    })
    getAllVoice()
    setRoleShowsInfos(roleData?.roleShowInfos??[])
  }, [roleData])


   const handleFormChange = (e) => {
      if (e.target.id === 'maxRelationship') {
        setMaxRelationship(e.target.value)
      }
      
      if (e.target.id.startsWith('intimacyInfoLevel')) {
        const index = e.target.id.split('intimacyInfoLevel')[1]
        const newList: RelationshipInfo[] = [
          ...roleShowsInfos,
        ]
        newList[index - 1] = {
          intimacyInfoLevel: index,
          relationPrompt: e.target.value,
          roleShows: roleShowsInfos[index - 1]?.roleShows
        }
        setRoleShowsInfos(newList)
      }
   }
  
  return<ProForm<{
      useMode?: string;
  }>
    onFinish={async (values) => {

      try {
        const postData = {
        roleId: roleData?.roleId,
        ...values,
        RoleShowInfos:roleShowsInfos
      }
        console.log('postData', postData)
        await saveRoleDetail(postData)
        message.success('提交成功');
      }catch (error) {
        message.error('提交失败请重试');
      }

    }}
    onChange={handleFormChange}
    formRef={formRef}
    params={{ id: '100' }}
    formKey="base-form-use-demo"
    dateFormatter={(value, valueType) => {
      console.log('---->', value, valueType);
      return value.format('YYYY/MM/DD HH:mm:ss');
    }}
    autoFocusFirstInput
    layout='horizontal'
    >
        <ProFormText
          width="md"
          name="roleName"
          required
          dependencies={[['contract', 'name']]}
          label="Name"
          tooltip="最长为 24 位"
          placeholder="请输入 Name"
        rules={[{ required: true, message: '这是必填项' }]}
        />
   
         <ProFormText
          width="md"
          name="gender"
          label="Gender"
          required
          placeholder="请输入 Gender"
    />
     <ProFormDigit
      name="age"
      label="Age"
      width="md"
      required />
    <ProForm.Item  label='Avatar' required>
        <Upload
        name="avatar"
        listType='picture-circle'
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleAvatarUploadChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </ProForm.Item>

   <ProFormTextArea
      name="character"
      label="Character"
      required />
    
   <ProFormTextArea
      name="hobby"
      label="Hobby"
      required />
   <ProFormTextArea
      name="Identity"
      label="Identity"
      required />
   <ProFormTextArea
      name="constellation"
      label="Constellation"
      required />
   <ProFormTextArea
      name="greetings"
      label="Greetings"
      required />
       <ProFormTextArea
      name="textDetailDesc"
      label="TextDetailDesc"
      required />   <ProFormTextArea
      name="scene"
      label="Scene"
      required />
    <ProFormTextArea
      name="informationShow"
      label="InformationShow"
      required />
     <ProFormSelect
    name="voice"
      label={`Voice\n（创建后不可编辑）`}
    options={voiceList}
    placeholder="Please select a Voice"
    rules={[{ required: true, message: 'Please select your country!' }]}
  />
    <ProFormDigit
      name="payVal"
      label="角色价格（金币"
      width="md"
      required
    />
    <ProFormDigit
      name="maxIntimacyLevel"
      label="最大亲密度等级"
      width="md"
      required
    />
    <ProFormDigit
      name="oneIntimacyValue"
      label="每个等级亲密度数值"
      width="md"
      required />
    {
      maxRelationship > 0 && Array.from({ length: maxRelationship }).map((_, index) => {
        return <RelationshipItem key={index} relationLevel={index + 1} roleShowInfo={roleData?.roleShowInfos?.[index]} setRoleShowsInfos={(fileSrtList: string[]) => {
          const newList: RelationshipInfo[] = [
            ...roleShowsInfos,
            ]
          newList[index] = {
            intimacyInfoLevel: index + 1,
            relationPrompt: fileSrtList[0],
            roleShows: fileSrtList
          }
          setRoleShowsInfos(newList)
        }} />
      })
    }
    </ProForm>
}


export default RoleInfoFrom
