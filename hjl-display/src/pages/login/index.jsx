import React, {Component} from 'react';
import './index.less'
import {Form, Input, Button, Icon, message} from "antd";
import {post} from "utils/request";


const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

@Form.create()
class Login extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.keyDown, false)
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDown, false)
  }
  keyDown = (e) => {
    if (e && e.keyCode === 13) {
      this.login()
    }
  }

  login = () => {
    const {validateFields, getFieldsValue} = this.props.form;
    validateFields( async err=>{
      if (!err) {
        const userInfo = getFieldsValue();
        const data = {type:'sys',...userInfo}
        const res = await post('','login',data);
        if (res.result) {
          const data = res.result
          sessionStorage.setItem('tokenId', data.sessionKey)
          this.props.history.push('/')
        } else {
          message.error(res.msg)
        }
      }
    })
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <div className='login-content'>
          <h3>慧景链上墙管理</h3>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: '#889aa4' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: '#889aa4' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          {/*<p className="tr">*/}
          {/*  <a className="login-form-forgot">忘记密码</a>*/}
          {/*</p>*/}
          <p>
            <Button onClick={this.login} type="primary"  className="login-form-button">登录</Button>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;