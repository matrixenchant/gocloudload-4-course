import ProductCard from '@/components/ProductCard';
import ShopLayout from '@/components/ShopLayout';
import ProductsStore from '@/stores/products.store';
import { Product } from '@/types/common.types';
import { List, Spin } from 'antd';
import { observer } from 'mobx-react';
import { useEffect } from 'react';

const HomePage = () => {
  const { data: products, loading } = ProductsStore.products;

  useEffect(() => {
    ProductsStore.products.call();
  }, []);

  return (
    <ShopLayout>
      <h1>Products</h1>

      <Spin spinning={loading} />

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={products}
        renderItem={(item: Product) => (
          <List.Item>
            <ProductCard product={item} />
          </List.Item>
        )}
      />
    </ShopLayout>
  );
};

export default observer(HomePage);
