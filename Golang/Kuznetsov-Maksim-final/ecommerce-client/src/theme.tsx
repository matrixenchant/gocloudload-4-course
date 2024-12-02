import { ConfigProvider, Typography } from 'antd';

const ThemeProvider = ({ children }: any) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Mulish',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
