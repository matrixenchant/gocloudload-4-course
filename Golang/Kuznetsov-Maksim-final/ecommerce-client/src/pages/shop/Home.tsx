import ProductCard from '@/components/ProductCard';
import ShopLayout from '@/components/ShopLayout';
import ProductsStore from '@/stores/products.store';
import { Product } from '@/types/common.types';
import { List, Spin, Tabs } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [category, setCategory] = useState('');
  const { data: products, loading } = ProductsStore.products;
  const { data: categories } = ProductsStore.categories;

  useEffect(() => {
    ProductsStore.products.call();
    ProductsStore.categories.call();
  }, []);

  useEffect(() => {
    setCategory(categories[0]?.category_id.toString());
  }, [categories]);

  return (
    <ShopLayout>
      <Spin spinning={loading} />
      <h1>Products</h1>

      <Tabs
        activeKey={category}
        items={categories.map((x) => ({
          key: x.category_id.toString(),
          label: x.name,
          children: (
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
              dataSource={products.filter((p) => p.category_id === x.category_id)}
              renderItem={(item: Product) => (
                <List.Item>
                  <ProductCard style={{ width: '100%' }} product={item} />
                </List.Item>
              )}
            />
          ),
        }))}
        onChange={(key) => setCategory(key)}
      />
    </ShopLayout>
  );
};

export default observer(HomePage);
