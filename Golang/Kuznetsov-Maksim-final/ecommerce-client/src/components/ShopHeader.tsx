import AuthStore from '@/stores/auth.store';
import UserStore from '@/stores/user.store';
import { UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import CartModalButton from './CartModal';

const items = [
  {
    key: 'home',
    label: 'Home',
  },
  {
    key: 'orders',
    label: 'My Orders',
  },
];

const profileMenu = {
  items: [
    { key: '1', label: 'Profile' },
    { key: '2', label: 'Settings' },
    { key: '3', label: 'Logout', onClick: () => AuthStore.logout() },
  ],
};

const ShopHeader = () => {
  const navigate = useNavigate();
  const user = UserStore.user;

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[window.location.pathname.slice(1)]}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
        onClick={(e) => navigate('/' + e.key)}
      />
      <Flex>
        <CartModalButton />
        <Dropdown menu={profileMenu} trigger={['click']}>
          <Button type="text" icon={<UserOutlined style={{ fontSize: '18px', color: 'white' }} />}>
            <span style={{ color: 'white' }}>{user?.username}</span>
          </Button>
        </Dropdown>
      </Flex>
    </Header>
  );
};

export default observer(ShopHeader);
