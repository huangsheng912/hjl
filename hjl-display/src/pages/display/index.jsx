import React, {Component} from 'react';
import './index.less'
import {post} from "utils/request";
import axios from 'axios'
const trackHeight = 80 //单条弹幕高度
class Display extends Component {
  page = 0
  tracks = []
  componentDidMount() {
    const wrapper = document.getElementById('wrapper')
    if (!wrapper) return
    const { height } = wrapper.getBoundingClientRect();
    //将屏幕按弹幕高度等分
    this.tracks = new Array(Math.floor(height / trackHeight)).fill('idle');
    this.getDisplayData()
    let timer = setInterval(()=>{
      if (this.page >= this.totalPage) {
        clearInterval(timer)
        return
      }
      this.getDisplayData()
    },5000)
  }
  testHttp() {
    axios.get('http://127.0.0.1:7001/user').then(res=>{

    }).catch(e=>{

    })
  }
  async getDisplayData() {
    const params = {
      "pageNumber": this.page++,
      "pageSize": 10,
      "scenicId": "",
      "placeId": "",
      "wxUserId": "",
      "provinceCode": "",
      "cityCode": "",
      "searchText": ""
    }
    //getDisplay params = {placeId: ''}
    const res = await post('', 'wordsPageList', params)
    if (res.result) {
      this.totalPage = res.result.totalPage
      const data = res.result.list
      for(let v of data) {
        await this._render(v)
      }
    }
  }

  async _render(v) {
    const div = document.createElement('div')
    div.className = 'display-item'
    div.id = Math.random().toString(36).substring(2);
    div.innerHTML= `<img class='user-avatar' src=${v.wxUserImg} alt="" />
      <span class='user-name'>${v.wxNickName}: </span>
      <span class='user-content'>
        ${v.content.length > 30 ? v.content.substr(0,30)+'...' : v.content}
    </span>`
    await this.setDivTop(div)
  }
  //设置弹幕高度
  async setDivTop(dom) {
    await new Promise((resolve, reject) => {
      setTimeout(async ()=>{
        let readyIdxs = []
        let idx = -1
        this.tracks.map((track, i) => {
          if (track === 'idle') {
            readyIdxs.push(i)
          }
        })
        if (readyIdxs.length) {
          idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
        }
        // console.log(idx,132)
        //如果弹幕轨道全部被占用 则寻找已完全显示弹幕 插入后面
        if (idx === -1) {
          this.tracks.map((track, i) => {
            if (track === 'feed') {
              readyIdxs.push(i)
            }
          })
          if (readyIdxs.length) {
            idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
          }
        }
        if (idx === -1) {
          this.setDivTop(dom)
        } else {
          this.tracks[idx] = 'running';
          dom.dataset.idx = idx;
          dom.style.top = idx * trackHeight + 'px'
          wrapper.appendChild(dom)
          this.animate(dom)
        }
        resolve()
      },500)
    })
  }
  animate(dom) {
    dom.style.left = (wrapper.clientWidth + 10) + 'px'
    // const times = 30*1000/16
    const speed = 1 //Math.ceil(wrapper.clientWidth / times)
    const rAF = window.requestAnimationFrame || (fn=>{setInterval(fn,16)})
    const clear = window.cancelAnimationFrame || (fn => clearInterval(fn))
    let fullyShow = false
    const move = ()=> {
      const offsetLeft = dom.offsetLeft
      // console.log(offsetLeft,33)
      if (offsetLeft + dom.clientWidth + 30 < wrapper.clientWidth && !fullyShow) {
        this.tracks[dom.dataset.idx] = 'feed'
        fullyShow = true
      }
      if (offsetLeft + dom.clientWidth < 0) {
        clear(timer)
        wrapper.removeChild(dom)
      } else {
        dom.style.left = (offsetLeft - speed)+'px'
        timer = rAF(move)
      }
    }
    let timer = rAF(move)
    dom.addEventListener('mouseenter', ()=>{
      clear(timer)
    })
    dom.addEventListener('mouseleave', ()=>{
      timer = rAF(move)
    })
  }
  render() {
    const token = sessionStorage.getItem('tokenId')
    if (!token) {
      this.props.history.push('/login')
      return null
    }
    return (
      <div className='display-page' >
        {/*<button onClick={()=>this.testHttp()}>测试egg发送请求</button>*/}
        <h3>XXX景点</h3>
        <div id='wrapper'></div>
      </div>
    );
  }
}

export default Display;