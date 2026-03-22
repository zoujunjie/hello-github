import { Content, Footer, Header } from "antd/es/layout/layout";
import Home from "./views/home";
import reactLogo from "./assets/react.svg";
import { Layout, Space, Image } from "antd";
import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <Layout className="app-container">
        <Header className="header-container">
          <Space align="center">
            <Image src={reactLogo} preview={false}></Image>
            <span className="title">Hello GitHub</span>
          </Space>
        </Header>
        <Content className="body-container">
          <Home></Home>
        </Content>
        <Footer className="footer-container">Created by Zou Junjie</Footer>
      </Layout>
    </>
  );
};

export default App;
