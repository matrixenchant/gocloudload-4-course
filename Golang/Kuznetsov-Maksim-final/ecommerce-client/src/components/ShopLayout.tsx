import { Layout } from 'antd';
import { ReactNode } from 'react';
import ShopHeader from './ShopHeader';

const { Content } = Layout;

const ShopLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ShopHeader />
      <Content style={{ padding: 16 }}>{children}</Content>
    </Layout>
  );
};

export default ShopLayout;
