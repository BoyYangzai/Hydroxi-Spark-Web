import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {  Button, Upload, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { approveReview, getVoiceList, saveRoleDetail } from '@/services/ant-design-pro/api';
import ButtonGroup from 'antd/es/button/button-group';

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


const GenderOptions = ['男', '女', '未知'];
const ConstellationOptions =["Scorpio","Pisces","Virgo","Taurus","Gemini","Cancer","Leo","Libra","Sagittarius","Aquarius","Aries","Capricorn" ]

const DetailInfoFrom = ({ roleData }) => {
  console.log(roleData)
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
    })
    getAllVoice()
    setRoleShowsInfos(roleData?.roleShowInfos ?? [])
    setMaxRelationship(roleData?.maxIntimacyLevel)
  }, [roleData])
  console.log(roleShowsInfos,'roleShowsInfos')

   const handleFormChange = (e) => {
      if (e.target.id === 'maxIntimacyLevel') {
        setMaxRelationship(e.target.value)
      }
      
      if (e.target.id.startsWith('intimacyInfoLevel')) {
        const index = e.target.id.split('intimacyInfoLevel')[1]
        const newList: RelationshipInfo[] = [
          ...roleShowsInfos,
        ]
        newList[index - 1] = {
          intimacyInfoLevel: Number(index),
          relationPrompt: e.target.value,
          roleShows: roleShowsInfos[index - 1]?.roleShows??[]
        }
        setRoleShowsInfos(newList)
      }
   }
  
  type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';

    const [formLayoutType, setFormLayoutType] = useState<LayoutType>(
    LAYOUT_TYPE_HORIZONTAL,
  );

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

  
  return<ProForm<{
      useMode?: string;
  }>
     {...formItemLayout}
      layout={formLayoutType}
    onChange={handleFormChange}
    formRef={formRef}
    params={{ id: '100' }}
    formKey="base-form-use-demo"
    dateFormatter={(value, valueType) => {
      console.log('---->', value, valueType);
      return value.format('YYYY/MM/DD HH:mm:ss');
    }}
    autoFocusFirstInput
    submitter={false}
    >
    <ProFormText
      disabled
      
          width="md"
          name="creatorId"
          required
          dependencies={[['contract', 'name']]}
          label="Creator ID"
          tooltip="最长为 24 位"
          placeholder="请输入 Name"
          rules={[{ required: true, message: '这是必填项' }]}
    />
    
    <ProFormText
      disabled
      
          width="md"
          name="name"
          required
          dependencies={[['contract', 'name']]}
          label="Name"
          tooltip="最长为 24 位"
          placeholder="请输入 Name"
          rules={[{ required: true, message: '这是必填项' }]}
        />
   
   
    <ProFormSelect
      disabled
      
      width={340}
    name="gender"
    label={`Gender`}
      options={GenderOptions.map((item) => {
        return {
          label: item,
          value: item
        }
      }
      )
    }
    placeholder="Please select a Gender"
    rules={[{ required: true, message: 'Please select your country!' }]}
  />
     <ProFormDigit
      name="age"
      label="Age"
      width="md"
      disabled

      required />
    <ProForm.Item  label='Avatar' required>
    <Upload
        name="avatar"
        listType='picture-a'
        disabled
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleAvatarUploadChange}
        customRequest={async (option: any) => {
          try {
            option.onSuccess()
          } catch (error) {
            option.onError(error)
          }
          }
        }
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{
          width: '130px',
          height: '130px'
        }}
        /> : uploadButton}
      </Upload>
    </ProForm.Item>
        <ProForm.Item  label='Photo' required>
      <img src={roleData?.photo} alt="avatar" style={{
        width: '130px',
        height: '190px'
      }}
        />
    </ProForm.Item>

   <ProFormTextArea
      name="personality"
      label="Personality"
      disabled

      required />
    
   <ProFormTextArea
      name="ourRelationshipDescription"
      label="Our Relationship description"
      disabled

      required />
   <ProFormTextArea
      name="relationshipLabel"
      label="Relationship label"
      disabled

      required />
       <ProFormTextArea
      name="relationshipLabel"
      label="Relationship label"
      disabled

      required />
    
       <ProFormTextArea
      name="ourStory"
      label="Our story"
      disabled
      required />
    
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
      
    }}>
      <div
        style={{
          width: '76%',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '20px',
        }}>
        <Button type="primary" htmlType="submit"
           style={{
            width: '220px',
            height: '40px'
          }}
              onClick={async () => {
                    await approveReview(roleData.roleId)
                    message.success('审核通过')
                }}
        >
        通过
      </Button>
        <Button htmlType="submit"
          type='default'
          style={{
            width: '220px',
            height: '40px'
        }}>
        下架
      </Button>
        <Button htmlType="submit"
          type='default'
           style={{
            width: '220px',
            height: '40px'
        }}
        >
        流水
      </Button>
    </div>
     </div>
    </ProForm>
}


export default DetailInfoFrom
