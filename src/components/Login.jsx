import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import { useState } from 'react';
import '../utils/apiUtil'
import { uniFetch } from '../utils/apiUtil';

function Login(props) {

    let [user, setUser] = useState("");
    let [pwd, setPwd] = useState("");


    let login = () => {
        let option = {
            method: "POST",
            body: {}
        }
        option.body.username = user;
        option.body.password = pwd;
        (async () => {
            let jwt = await uniFetch("/login", option);
            if (jwt) {
                localStorage.setItem('jwt', jwt);
                props.loginMethod();
            }
        })();
    }

    return (
        <div id="login-form" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: 100 }}>
            <Form method="post" style={{ maxWidth: 600 }} >
                <Form.Item rules={[{
                    required: true,
                    message: '请输入用户名',
                }]}>
                    <Input prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Username"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                    />
                </Form.Item>
                <Form.Item rules={[{
                    required: true,
                    message: '请输入密码',
                }]}>
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        value={pwd}
                        onChange={e => setPwd(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={login} style={{ width: '100%' }}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login