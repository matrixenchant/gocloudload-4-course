import CartsStore from '@/stores/cart.store';
import UserStore from '@/stores/user.store';
import { Product } from '@/types/common.types';
import { getApiErrorMessage } from '@/utils/api.utils';
import { PhotoIcon, StarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button, Card, Flex, Image, List, Typography } from 'antd';
import { CSSProperties } from 'react';
import toast from 'react-hot-toast';
import ReviewModal from './ReviewModal';

const { Title, Text } = Typography;

const ProductCard = ({ product, style }: { product: Product; style?: CSSProperties }) => {
  const user = UserStore.user;

  const onAddCartItem = async () => {
    try {
      await CartsStore.addCartItem(product.product_id, 1);
      await CartsStore.myCarts.call();

      toast.success('Product added to cart');
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <Card
      title={product.name}
      cover={
        product.images ? (
          <Image.PreviewGroup items={product.images.map((x) => x.image_url)}>
            <Image
              height={300}
              style={{ objectFit: 'contain' }}
              alt={product.name}
              src={product.images[0]?.image_url}
            />
          </Image.PreviewGroup>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 100,
            }}
          >
            <PhotoIcon style={{ width: 64 }} />
          </div>
        )
      }
      style={{ width: 300, ...style }}
    >
      <Button onClick={onAddCartItem}>Add to cart</Button>
      <Title level={5}>Price: ${product.price.toFixed(2)}</Title>
      <Text type={product.stock > 0 ? 'success' : 'danger'}>
        {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
      </Text>
      <br />
      <Text>{product.description}</Text>
      <br />
      <Title level={5}>Category: {product.category?.name || '--'}</Title>
      <Title level={5}>Reviews:</Title>
      <List
        size="small"
        pagination={{ position: 'bottom', align: 'center', pageSize: 3, size: 'small' }}
        bordered
        dataSource={product.reviews || []}
        renderItem={(review) => (
          <List.Item
            actions={[
              <Flex align="center" gap={8}>
                <StarIcon style={{ width: 16 }} />
                <Text strong>{review.rating}</Text>
              </Flex>,
              review.user_id === user?.user_id ? (
                <Button size="small" icon={<TrashIcon style={{ width: 14 }} />}></Button>
              ) : null,
            ]}
          >
            <Text style={{ flex: 1 }}>{review.comment}</Text>
          </List.Item>
        )}
        locale={{ emptyText: 'No reviews yet' }}
      />
      <ReviewModal productId={product.product_id} />
    </Card>
  );
};

export default ProductCard;
