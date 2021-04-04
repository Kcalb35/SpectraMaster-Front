import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from "./components/Login";
import About from "./components/About";
import SearchComplex from "./components/Search"
import { Answer } from "./components/Detail";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
const { Header, Footer, Content } = Layout

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo"></div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} >
            <Menu.Item key="1">
              <Link to="/" style={{ fontSize: "16px" }}>首页</Link>
            </Menu.Item>
            <Menu.Item key="2"><Link to="/mass">质谱题解搜索</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/nmr">核磁谱题解搜索</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/complex">综合题解搜索</Link></Menu.Item>
            <Menu.Item key="5"><Link to="/about">帮助与关于</Link></Menu.Item>
            <Menu.Item key="6">
              <Link to="/login" style={{ fontSize: "16px" }}>后台登录</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/mass">
                <SearchComplex mass={true} nmr={false}></SearchComplex>
              </Route>
              <Route path="/nmr">
                <SearchComplex mass={false} nmr={true}></SearchComplex>
              </Route>
              <Route path="/complex">
                <SearchComplex mass={true} nmr={true}></SearchComplex>
              </Route>
              <Route path="/answer/:id" children={<Answer />}></Route>
              <Route path="/">
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>祝所有人都能称为解谱小专家</Footer>
      </Layout>
    </Router>
  );
}

export default App;
