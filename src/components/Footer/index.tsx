import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Spark',
          title: 'Spark',
          href: 'https://hydrox.ai',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/hydroxai',
          blankTarget: true,
        },
        {
          key: 'Hydrox AI',
          title: 'Hydrox AI',
          href: 'https://hydrox.ai',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
