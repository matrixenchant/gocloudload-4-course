import ProductsStore from '@/stores/products.store';
import UserStore from '@/stores/user.store';
import { getApiErrorMessage } from '@/utils/api.utils';
import { Button, Form, Input, Modal, Rate } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ReviewModal = ({ productId }: { productId: number }) => {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  const handleOk = async () => {
    if (rating && review) {
      try {
        await UserStore.addReview.call({ product_id: productId, rating, comment: review });
        await ProductsStore.products.call();
        setVisible(false);
        toast.success('Review added successfully');
      } catch (e: any) {
        toast.error(getApiErrorMessage(e));
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) {
      setRating(0);
      setReview('');
    }
  }, [visible]);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Write a Review
      </Button>

      <Modal
        title="Write a Review"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add Review"
        cancelText="Cancel"
      >
        <Form>
          <Form.Item label="Rating" required>
            <Rate value={rating} onChange={setRating} />
          </Form.Item>

          <Form.Item label="Review" required>
            <Input.TextArea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReviewModal;
