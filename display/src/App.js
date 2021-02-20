import { hot } from "react-hot-loader/root";
import React from 'react';
import './style'
import { BrowserRouter, Route, Switch} from "react-router-dom";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import Loadable from 'react-loadable';
const LoadableBar = function (loader){
  return Loadable({
    loader,
    loading() {
      return null
    }
  })
}
const Login = LoadableBar(()=>import('page/login'))
const Display = LoadableBar(()=>import('page/display'))

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <ConfigProvider locale={zhCN}>
          <Switch>
            <Route path='/login' exact component={Login} />
            <Route path='/' component={Display} />
          </Switch>
        </ConfigProvider>
      </BrowserRouter>
    )
  }
}
export default hot(App)

