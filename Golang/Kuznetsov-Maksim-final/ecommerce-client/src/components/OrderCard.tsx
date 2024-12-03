import UserStore from '@/stores/user.store';
import { Order } from '@/types/common.types';
import { getApiErrorMessage } from '@/utils/api.utils';
import { formatPrice } from '@/utils/format.utils';
import { Button, Card, Col, Divider, Flex, Row, Space, Tag, Typography } from 'antd';
import { CSSProperties } from 'react';
import toast from 'react-hot-toast';

const { Text } = Typography;

const OrderCard = ({ order, style }: { order: Order; style?: CSSProperties }) => {
  const onCancelOrder = async () => {
    try {
      await UserStore.cancelOrder.call(order.order_id);
      await UserStore.orders.call();
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const onPayOrder = async () => {
    try {
      await UserStore.payOrder.call(order.order_id);
      await UserStore.orders.call();
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <Card title={`Order #${order.order_id}`} style={{ width: 300, ...style }}>
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <Text strong>Date:</Text> {new Date(order.order_date).toLocaleDateString()}
        </Col>
        <Col span={24}>
          <Text strong>Status:</Text> <Space />
          {order.status === 'FILLED' && <Tag color="green">{order.status}</Tag>}
          {order.status === 'PENDING' && <Tag color="orange">{order.status}</Tag>}
          {order.status === 'CANCELLED' && <Tag color="red">{order.status}</Tag>}
        </Col>
        <Col span={24}>
          <Text strong>Total Amount:</Text> {formatPrice(order.total_amount)}
        </Col>
        {order.status === 'FILLED' && (
          <Col span={24}>
            <Text strong>Payment Method:</Text> {order.payment.payment_method}
          </Col>
        )}
        <Col span={24}>
          <Text strong>Cart ID:</Text> {order.cart_id}
        </Col>
      </Row>
      <Divider />
      <Flex gap={8}>
        {order.status === 'PENDING' && (
          <Button danger onClick={onCancelOrder}>
            Cancel
          </Button>
        )}
        {order.status === 'PENDING' && <Button onClick={onPayOrder}>Pay</Button>}
      </Flex>
    </Card>
  );
};

export default OrderCard;
