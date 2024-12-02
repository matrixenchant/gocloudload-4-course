import AuthStore from '@/stores/auth.store';
import { getApiErrorMessage } from '@/utils/api.utils';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { observer } from 'mobx-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface RegisterFormValues {
  username: string;
  password: string;
  email: string;
}

const RegisterPage = () => {
  const onFinish = async (values: RegisterFormValues) => {
    console.log(values);

    try {
      await AuthStore.register(values);
    } catch (e: any) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <Row justify="center" align="middle" style={{ width: '100%', minHeight: '70vh' }}>
      <Col>
        <Card style={{ width: 400 }} title="Auth" bordered>
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserIcon />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input prefix={<EnvelopeIcon />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input prefix={<LockClosedIcon />} type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={false}>
                Register
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            Already has account? <Link to="/auth">Login here</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default observer(RegisterPage);
