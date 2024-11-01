import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return <section className="py-8 md:py-10 max-w-3xl mx-auto">{children}</section>;
};

export default Layout;
