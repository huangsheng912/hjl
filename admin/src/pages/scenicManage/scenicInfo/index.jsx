import React from 'react'
import './index.less';
import {post} from 'utils/request'
import {Button, Input, Select, Modal, message, Divider} from "antd";
import moment from "moment";
import Table from "components/Table";
import {inject, observer} from "mobx-react";

const {Option} = Select
const { confirm } = Modal;

@inject('configStore')
@observer
class ScenicInfo extends React.Component {
  state={
    tableLoading: true,
    list: [],
    pageNumber: 0,
    pageSize: 10,
    total: 0,
    canCreateScenic: false
  }
  componentDidMount() {
    this.getList()
  }

  async getList(){
    const { scenicId, role } = this.props.configStore.configInfo
    let method, params
    if (role === 'scenic') {
      if (scenicId) {
        method = 'getScenicInfo'
        params = {scenicId}
      } else {
        this.setState({
          tableLoading: false,
          canCreateScenic: true
        })
        return null
      }
    } else {
      method = 'scenicPageList'
      params = {
        pageNumber: this.state.pageNumber,
        pageSize: this.state.pageSize,
      }
    }
    const res = await post('', method, params);
    if (res.result) {
      if (scenicId) {
        this.setState({
          tableLoading: false,
          total: 1,
          list:  [res.result]
        })
      } else {
        this.setState({
          tableLoading: false,
          total: res.result.totalCount,
          list:  res.result.list
        })
      }
    }
  }
  //添加、编辑、审核景区
  addScenic() {
    this.props.history.push('/scenicManage/scenicInfo/addScenic')
  }
  //下拉回调
  handleChange(v,type) {
    // console.log(v,111,type)
    this.setState({
      [type]:v
    })
  }
  //输入框回调
  changeAddress(v,type) {
    let val = v.target.value
    this.setState({
      [type]:val
    })
  }
  //列表查询
  doSearch=()=>{
    const {type,status,minAmount,maxAmount} = this.state;
    this.setState({
      tableLoading: true,
      pageNumber:0
    },this.getList)
  }
  //分页
  changeSize=(page,size)=>{
    this.setState({
      tableLoading: true,
      pageNumber: page
    },this.getList)
  }
  toEdit = (id) => {
    this.props.history.push('/scenicManage/scenicInfo/editScenic?id='+id+'&edit=true')
  }
  //审核
  audit = (id) => {
    this.props.history.push('/scenicManage/scenicInfo/auditScenic?id='+id)
  }
  render() {
    const { list, total, tableLoading, pageNumber, canCreateScenic} = this.state;
    const {scenicId, role} = this.props.configStore.configInfo
    const columns=[
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        render: (text, row, index) => {
          return (index+1) + this.state.pageNumber*this.state.pageSize
        }
      },
      {
        title: '景区名称',
        key: 'scenicName',
        dataIndex: 'scenicName',
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '打卡地址数',
        dataIndex: 'places',
        key: 'places',
        render: (text,record)=> record.placeList ? record.placeList.length: 0
      },
      {
        title: '经营主体',
        dataIndex: 'company',
        key: 'company',
      },
      {
        title: '状态',
        dataIndex: 'statusText',
        key: 'statusText',
      },
      {
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        render: (text,item)=> {
          if (role === 'sys') {
            if (text === '1') {
              return (
                <span>
                  <a onClick={()=>this.audit(item.id)}>审核</a>
                </span>
              )
            } else {
              return null
            }
          } else {
            if (text === '0') {
              //未入驻
              return (
                <span>
                 <a onClick={()=>showModal('new',item.id)}>申请入驻</a>
                 <Divider type="vertical" />
                 <a onClick={()=>this.toEdit(item.id)}>编辑</a>
              </span>
              )
            } else if (text === '2') {
              //运营中
              return (
                <span>
                <a onClick={()=>this.toEdit(item.id)}>编辑</a>
                  {/*<Divider type="vertical" />
                <a onClick={()=>this.addPunchPoint(item.id)}>添加打卡点</a>*/}
              </span>
              )
            } else if (text === '3') {
              //驳回
              return (
                <span>
                <a onClick={()=>showModal('old',item.id)}>重新申请</a>
                <Divider type="vertical" />
                <a onClick={()=>this.toEdit(item.id)}>编辑</a>
              </span>
              )
            } else {
              return null
            }
          }
        }
      }
    ]
    //申请入驻弹窗
    function showModal(type,id) {
      const title = type === 'new' ? '确定申请入驻' : '确定申请复审'
      confirm({
        title: title,
        content: '',
        onOk() {
          return new Promise((resolve, reject) => {
            post('', 'applyScenic', {scenicId: id}).then(res=>{
              if (res.result && res.result.result) {
                message.success('已发送申请');
                this.setState({
                  pageNumber: 1
                }, this.getList)
              } else {
                message.error('发送申请失败');
              }
              resolve()
            }).catch(e=>{
              reject(e)
            })
          }).catch(() => console.log('error'));
        },
        onCancel() {},
      });
    }
    return (
      <div className='scenic-info-page'>
         <div className="table-search">
          <span className='search-label'>景区总数：{total}</span>
          <span className='search-label'>打卡地址数：</span>
           {canCreateScenic &&<div className='fr'>
            <Button type='primary' onClick={()=>this.addScenic()}>新增景区</Button>
          </div>}
        </div>
        <div className='bg-white'>
          {/*<div className='list-search hidden'>
            <div className='fl'>
              状态&nbsp;&nbsp;&nbsp;
              <Select defaultValue={''} onChange={(v)=>this.handleChange(v,'orderState')}>
                {
                  orderStateType.map((v,i)=><Option value={v.value} key={i}>{v.label}</Option>)
                }
              </Select>
            </div>
            <div className='fl address-search'>
              地址&nbsp;&nbsp;&nbsp;
              <Input value={key} onChange={(v)=>this.changeAddress(v,'key')} placeholder='查询地址'/>
            </div>
            <div className='fr'>
              <Button type='primary' onClick={this.doSearch}>查询</Button>
            </div>
          </div>*/}
          <Table
            columns={columns}
            dataSource={list}
            loading={tableLoading}
            total={total}
            changeSize={this.changeSize}
            currentPage={pageNumber}
          />
        </div>
      </div>
    )
  }
}

export default ScenicInfo