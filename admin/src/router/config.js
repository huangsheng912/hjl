import Loadable from 'react-loadable';
import React from 'react'

const LoadableBar = function (loader){
  return Loadable({
    loader,
    loading() {
      return null
    }
  })
}
const ScenicData = LoadableBar(()=>import('page/scenicManage/scenicData'));
const Audit = LoadableBar(()=>import('page/scenicManage/audit'));
const ScenicInfo = LoadableBar(()=>import('page/scenicManage/scenicInfo'));
const PunchPoint = LoadableBar(()=>import('page/scenicManage/punchPoint'));
const WallInfo = LoadableBar(()=>import('page/scenicManage/wallInfo'));

const EditScenic = LoadableBar(()=>import('page/scenicManage/scenicInfo/editScenic'));
const AddScenic = LoadableBar(()=>import('page/scenicManage/scenicInfo/addScenic'));
const AuditScenic = LoadableBar(()=>import('page/scenicManage/scenicInfo/auditScenic'));

const AddPunchPoint =  LoadableBar(()=>import('page/scenicManage/punchPoint/addPunchPoint'));
const EditPunchPoint =  LoadableBar(()=>import('page/scenicManage/punchPoint/editPunchPoint'));
const Profit = LoadableBar(()=>import('page/assetsManage/profit'));
const Integral = LoadableBar(()=>import('page/assetsManage/integral'));

const AccountManage = LoadableBar(()=>import('page/systemManage/accountManage'));
const BannerManage = LoadableBar(()=>import('page/systemManage/bannerManage'));




const config = [
  {
    title: '景区管理',
    icon: 'control',
    value:'scenicManage',
    role: ['scenic', 'sys'],
    children:[
      /*{
        title: '景区数据',
        value: '/scenicManage/scenicData',
        component: ScenicData
      },
      {
        title: '入驻审核',
        value: '/scenicManage/audit',
        component: Audit
      },*/
      {
        title: '景区信息',
        value: '/scenicManage/scenicInfo',
        component: ScenicInfo,
        role: ['scenic', 'sys']
      },
      {
        title: '新增景区',
        value: '/scenicManage/scenicInfo/addScenic',
        detail: true,
        component: AddScenic,
        role: 'scenic'
      },
      {
        title: '编辑景区',
        value: '/scenicManage/scenicInfo/editScenic',
        detail: true,
        component: EditScenic,
        role: 'scenic'
      },
      {
        title: '审核景区',
        value: '/scenicManage/scenicInfo/auditScenic',
        detail: true,
        component: AuditScenic,
        role: 'sys'
      },
      {
        title: '打卡点管理',
        value: '/scenicManage/punchPoint',
        component: PunchPoint,
        role: 'scenic'
      },
      {
        title: '新增打卡点',
        value: '/scenicManage/punchPoint/addPunchPoint',
        detail: true,
        component: AddPunchPoint,
        role: 'scenic'
      },
      {
        title: '编辑打卡点',
        value: '/scenicManage/punchPoint/editPunchPoint',
        detail: true,
        component: EditPunchPoint,
        role: 'scenic'
      },
      {
        title: '上墙信息',
        value: '/scenicManage/wallInfo',
        component: WallInfo,
        role: 'scenic'
      }
    ]
  },
  /*{
    title: '资产管理',
    icon: 'account-book',
    value:'assetsManage',
    children:[
      {
        title: '利润明细',
        value: '/assetsManage/profit',
        component: Profit
      },
      {
        title: '积分明细',
        value: '/assetsManage/integral',
        component: Integral
      }
    ]
  },*/
  {
    title: '系统管理',
    icon: 'setting',
    value:'systemManage',
    role: 'sys',
    children:[
      {
        title: '账号管理',
        value: '/systemManage/accountManage',
        component: AccountManage,
        role: 'sys',
      },
      {
        title: '轮播图管理',
        value: '/systemManage/bannerManage',
        component: BannerManage,
        role: 'sys',
      },
      /*{
        title: '系统设置',
        value: '/assetsManage/setting',
        component: Setting
      }*/
    ]
  }
]

export default config