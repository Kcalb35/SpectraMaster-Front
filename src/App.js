import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { useEffect,useState } from "react";
import Login from "./components/Login";
import About from "./components/About";
import { SearchComplex } from "./components/Search"
import { Answer, AnswersList } from "./components/Detail";
import { CreateAnswer } from "./components/CreateAnswer";
import { Layout, Menu, Result } from "antd";
import { UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import { UpdateAnswer } from './components/UpdateAnswer';
import MainPage from './components/MainPage';
const { Header, Footer, Sider, Content } = Layout

function App() {


  let [login,setLogin] = useState(false);
 
  useEffect(()=>{
    if  (!localStorage.getItem('jwt')) setLogin(false);
    else setLogin(true);
  },[]);

  return (
    <Router>
      <Layout className="layout" style={{ height: '100%' }}>
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
        <Switch>
          <Route path="/backend">
            <Layout>
              <Sider width={180} className="site-layout-background">
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <Menu.Item key="1" icon={<QuestionCircleOutlined />}><Link to="/backend/answers">题解管理</Link></Menu.Item>
                  <Menu.Item key="2" icon={<UserOutlined />}><Link to="/backend/users">用户管理</Link></Menu.Item>
                </Menu>
              </Sider>
              <Layout style={{ padding: '0 0 0 24px' }}>
                <Content
                  className="backend-layout-bg"
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: "80vh",
                  }}
                >
                  <Route path="/backend/create">
                    <CreateAnswer></CreateAnswer> 
                  </Route>
                  <Route path="/backend/update/:id">
                    <UpdateAnswer></UpdateAnswer>
                  </Route>
                  <Route path="/backend/answers">
                    <AnswersList></AnswersList>
                  </Route>
                  <Route path="/backend/users"><h2>前后端都还没做</h2></Route>
                  <Route exact path="/backend/">
                    <Redirect to="/backend/answers"></Redirect>
                  </Route>
                </Content>
              </Layout>
            </Layout>
          </Route>
          <Content style={{ padding: '0 50px' }} className="site-layout-context">
            <div className="site-layout-content">
              <Route path="/about">
                <About />
              </Route>
              <Route path="/login">
                {login?<Redirect to="/backend/"/>:<Login loginMethod={()=>{setLogin(true);}}/>}
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
              <Route path="/404">
                <Result status='404' title='404'></Result>
              </Route>
              <Route exact path="/">
                <MainPage/>
              </Route>
            </div>
          </Content>
        </Switch>
        <Footer style={{ textAlign: 'center' }}>祝所有人都能称为解谱小专家</Footer>
      </Layout>
    </Router>
  );
}

export default App;
