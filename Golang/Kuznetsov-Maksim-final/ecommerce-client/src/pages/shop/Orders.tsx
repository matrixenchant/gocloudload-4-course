import OrderCard from '@/components/OrderCard';
import ShopLayout from '@/components/ShopLayout';
import UserStore from '@/stores/user.store';
import { List, Spin } from 'antd';
import { observer } from 'mobx-react';
import { useEffect } from 'react';

const Orders = () => {
  const { data: orders, loading } = UserStore.orders;

  useEffect(() => {
    UserStore.orders.call();
  }, []);

  return (
    <ShopLayout>
      <h1>Orders</h1>

      <Spin spinning={loading} />

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 3,
        }}
        dataSource={orders}
        renderItem={(item) => (
          <List.Item>
            <OrderCard style={{ width: '100%' }} order={item} />
          </List.Item>
        )}
      />
    </ShopLayout>
  );
};

export default observer(Orders);
