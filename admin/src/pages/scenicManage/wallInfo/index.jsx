import React from 'react'
import './index.less';
import {post} from 'utils/request'
import {Button, DatePicker, Input, Modal, Select, Tooltip} from "antd";
import moment from "moment";
import Table from "components/Table";
import {observer, inject} from "mobx-react";

const {RangePicker} = DatePicker;
const configInfo = JSON.parse(localStorage.getItem('configInfo')) || {};

@inject('configStore')
@observer
class WallInfo extends React.Component {
  state = {
    tableLoading: true,
    pageNumber: 0,
    pageSize: 10,
    total: 0,
    list: [],
    scenicList: [],
    placeList: [],
    scenicId:'',
    placeId:'',
    searchText:''
  }

  componentDidMount() {
    this.getList()
    // this.getScenic()
    this.getPlaceList()
  }

  //留言列表
  async getList() {
    const { scenicId } = this.props.configStore.configInfo
    if (!scenicId) {
      this.setState({
        tableLoading: false
      })
    } else {
      this.setState({
        tableLoading: true
      })
      const {pageNumber, pageSize, placeId, searchText} = this.state
      const params = {
        pageNumber,
        pageSize,
        scenicId,
        placeId,
        wxUserId: "",
        searchText,
        provinceCode: "",
        cityCode: ""
      }
      const res = await post('', 'wordsPageList', params);
      if (res.result) {
        this.setState({
          tableLoading: false,
          list: res.result.list,
          total: res.result.totalCount
        })
      }
    }
  }

  //获取所有景区
  async getScenic() {
    const params = {
      pageNumber: 0,
      pageSize: 100
    }
    const res = await post('', 'scenicPageList', params);
    if (res.result) {
      this.setState({
        scenicList: [...res.result.list]
      },this.getPlaceList)
    }
  }

  //打卡点
  async getPlaceList(){
    const params = {
      pageNumber: 0,
      pageSize: 100,
      scenicId: ''
    }
    const res = await post('', 'placePageList', params);
    if (res.result) {
      /*res.result.list.map(v=>{
        const scenic = this.state.scenicList.filter(scenic=>v.scenicId === scenic.id)[0]
        v.scenicName = scenic ? scenic.scenicName : ''
      })*/
      this.setState({
        placeList: res.result.list
      })
    }
  }

  //列表查询
  doSearch = () => {
    this.setState({
      tableLoading: true,
      page: 0
    }, this.getList)
  }
  //分页
  changeSize = (pageNumber, pageSize) => {
    this.setState({
      pageNumber
    }, this.getList)
  }
  toDetail = (id) => {

  }

  render() {
    const { scenicList, placeList, list, total, tableLoading, pageNumber, pageSize, searchText } = this.state;
    const columns = [
      {
        key: 'index',
        dataIndex: 'index',
        title: '编号',
        render: (text, row, index) => {
          return (index+1) + pageNumber*pageSize
        }
      },
      {
        key: 'content',
        dataIndex: 'content',
        title: '上墙内容',
        render: (text) => {
          if (text.length> 30) {
            return (
              <Tooltip title={text} getPopupContainer={()=>this.wrap}>
                <span>{text.substring(0,30)+'...'}</span>
              </Tooltip>
            )
          } else {
            return text
          }
        }
      },
      {
        key: 'scenicName',
        dataIndex: 'scenicName',
        title: '所属景区',
      },
      {
        key: 'placeName',
        dataIndex: 'placeName',
        title: '所属景点',
      },
      {
        key: 'wxNickName',
        dataIndex: 'wxNickName',
        title: '用户名'
      },
      /*{
        key: 'time',
        dataIndex: 'time',
        title: '上墙时间'
      },
      {
        key: 'level',
        dataIndex: 'level',
        title: '危险等级'
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '状态'
      },
      {
        key: 'operate',
        dataIndex: 'operate',
        title: '操作',
        render: (text, record) => <a onClick={() => this.toDetail(record.date)}>屏蔽</a>
      },*/
    ]
    return (
      <div className='wall-info' ref={v=>this.wrap=v}>
        <div className="bg-white">
          {/*<div className='list-search hidden'>
            <div className='fl'>
              日期范围&nbsp;&nbsp;&nbsp;
              <RangePicker
                // showTime={{ format: 'HH:mm' }}
                // format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '截止时间']}
                onChange={this.onTimeChange}
              />
            </div>
            <div className='fr'>
              <Button type='primary' onClick={this.doSearch}>查询</Button>
            </div>

          </div>*/}
          <div className='list-search hidden'>
            {/*<div className='fl'>
              景区&nbsp;&nbsp;&nbsp;
              <Select defaultValue='' allowClear onChange={(v)=>this.setState({scenicId: v||''})}>
                {scenicList.map(scenic=><Option key={scenic.id} value={scenic.id}>{scenic.scenicName}</Option>)}
              </Select>
            </div>*/}
            <div className='fl'>
              景点&nbsp;&nbsp;&nbsp;
              <Select defaultValue='' allowClear onChange={(v)=>this.setState({placeId: v||''})}>
                {placeList.map(scenic=><Option key={scenic.id} value={scenic.id}>{scenic.name}</Option>)}
              </Select>
            </div>

            <div className='fl'>
              <Input className='search-input' placeholder='请输入留言信息'
                     value={searchText}
                     onChange={(e)=>this.setState({searchText: e.target.value})} />
            </div>
            <div className='fl'>
              <Button type='primary' onClick={this.doSearch}>查询</Button>
            </div>
          </div>
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

export default WallInfo