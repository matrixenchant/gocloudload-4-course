import CartsStore from '@/stores/cart.store';
import UserStore from '@/stores/user.store';
import { CartItem, ShoppingCart } from '@/types/common.types';
import { getApiErrorMessage } from '@/utils/api.utils';
import { formatPrice } from '@/utils/format.utils';
import { MinusIcon, PlusIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Avatar, Badge, Button, Col, Flex, List, Modal, Tabs } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CartModalButton = () => {
  const [cartVisible, setCartVisible] = useState(false);

  const activeCartId = CartsStore.activeCartId;
  const activeCart = CartsStore.myCarts.data.find((cart) => cart.cart_id === activeCartId);

  useEffect(() => {
    if (cartVisible) CartsStore.myCarts.call();
  }, [cartVisible]);

  useEffect(() => {
    if (CartsStore.myCarts.data.length > 0) {
      CartsStore.setActiveCartId(CartsStore.myCarts.data[0].cart_id);
    }
  }, [CartsStore.myCarts.data]);

  const handleNewCart = async () => {
    try {
      const res = await CartsStore.createCart.call();
      CartsStore.setActiveCartId(res.data.cart_id);

      await CartsStore.myCarts.call();
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveCart = async (id: number) => {
    try {
      await CartsStore.deleteCart.call(id);
      await CartsStore.myCarts.call();

      if (activeCartId === id && CartsStore.myCarts.data.length > 0) {
        CartsStore.setActiveCartId(CartsStore.myCarts.data[0].cart_id);
      }
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const onChange = (newActiveKey: string) => {
    CartsStore.setActiveCartId(+newActiveKey);
  };

  const onEdit = async (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      await handleNewCart();
    } else if (action === 'remove') {
      const id = Number(targetKey);
      if (!isNaN(id)) {
        await handleRemoveCart(id);
      }
    }
  };

  return (
    <>
      <Button
        type="text"
        icon={<ShoppingCartIcon style={{ width: 20, fontSize: '18px', color: 'white' }} />}
        onClick={() => setCartVisible(true)}
      >
        <Badge count={activeCart?.items?.length || 0} offset={[-5, 5]} showZero={false} />
      </Button>

      <Modal
        title="Shopping Cart"
        open={cartVisible}
        onClose={() => setCartVisible(false)}
        onCancel={() => setCartVisible(false)}
        footer={null}
      >
        <Tabs
          type="editable-card"
          onChange={onChange}
          activeKey={activeCartId?.toString() || undefined}
          onEdit={onEdit}
          items={CartsStore.myCarts.data.map((cart) => ({
            label: `Cart #${cart.cart_id}`,
            key: String(cart.cart_id),
            children: <CartItems cart={cart} />,
          }))}
        />
      </Modal>
    </>
  );
};

const CartItems = ({ cart }: { cart: ShoppingCart }) => {
  const navigate = useNavigate();

  if (!cart.items?.length) return <p>No items in cart</p>;

  const firstImg = cart.items[0].product?.images?.[0].image_url;

  const totalAmount =
    cart.items.reduce((x, prev) => prev.product.price * prev.quantity + x, 0) || 0;

  const onUpdateCartItem = async (item: CartItem, quantity: number) => {
    try {
      await CartsStore.updateItem.call(item.cart_item_id.toString(), { ...item, quantity });
      await CartsStore.myCarts.call();
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const onDeleteCartItem = async (item: CartItem) => {
    try {
      await CartsStore.deleteItem.call(item.cart_item_id.toString());
      await CartsStore.myCarts.call();
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const onCheckout = async () => {
    try {
      await CartsStore.checkoutCart.call({ cart_id: cart.cart_id });
      await UserStore.orders.call();
      navigate('/orders');
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <Col>
      <List
        itemLayout="horizontal"
        dataSource={cart.items}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Flex gap={8} align="center">
                <Button
                  onClick={() => onUpdateCartItem(item, item.quantity - 1)}
                  size="small"
                  icon={<MinusIcon style={{ width: 16 }} />}
                ></Button>
                <div>{item.quantity}</div>
                <Button
                  onClick={() => onUpdateCartItem(item, item.quantity + 1)}
                  size="small"
                  icon={<PlusIcon style={{ width: 16 }} />}
                ></Button>
              </Flex>,
              <Button
                onClick={() => onDeleteCartItem(item)}
                color="danger"
                icon={<TrashIcon style={{ width: 16 }} />}
              ></Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                firstImg ? (
                  <Avatar src={item.product.images?.[0].image_url} />
                ) : (
                  <ShoppingCartIcon style={{ width: 24 }} />
                )
              }
              title={item.product.name}
              description={`${formatPrice(item.product.price * item.quantity)}`}
            />
          </List.Item>
        )}
      />

      <div>
        <p>Items in cart: {cart.items.length}</p>
        <p>Total amount: {formatPrice(totalAmount)}</p>

        <Button loading={CartsStore.checkoutCart.loading} onClick={onCheckout} type="primary">
          Checkout
        </Button>
      </div>
    </Col>
  );
};

export default observer(CartModalButton);
