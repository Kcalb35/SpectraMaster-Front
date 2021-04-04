import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import  "antd/dist/antd.css";

function Login() {
    return (
        <div id="login-form" style={{display:'flex',flexDirection:'row',justifyContent:'space-around',padding:100}}>
            <Form method="post" style={{maxWidth:600}} >
                <Form.Item rules={[{
                    required: true,
                    message: '请输入用户名',
                }]}>
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item rules={[{
                    required: true,
                    message: '请输入密码',
                }]}>
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login