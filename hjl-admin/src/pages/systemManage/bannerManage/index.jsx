import React from 'react'
import './index.less';
import {upload,post} from 'utils/request'
import {
  Icon,
  Button,
  Upload,
  message
} from 'antd';
import Viewer from 'react-viewer'
import moment from "moment";




function PicWrap({src,remove,previewImage}) {
  return (
    <div className='pic-wrap' onClick={previewImage}>
      <img src={src} alt=""/>
      <Icon type='close' onClick={remove}/>
    </div>
  )
}

class BannerManage extends React.Component {
  state={
    pictures : [], //景区照片
    previewImgs: [],
    activeIndex: 0,
    visible: false, //预览图片
  }
  componentDidMount() {
    this.getBanner()
  }

  getBanner() {
    post('', 'getBanner', []).then(res=>{
      if (res.result) {
        this.setState({
          pictures: res.result
        })
      }
    })
  }

  beforeUpload = (file) => {
    // console.log(file, name,55)
    this.myUpload(file)
    return false
  }
  //上传图片
  myUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await upload('/upload/image', formData)
    if (res.result) {
      this.setState(state => {
        return {
          pictures: [...state.pictures, res.result.url]
        }
      })
    }
  }
  //预览图片
  previewImage = (pics, index) =>{
    const images = pics.map(pic=>({src: pic}))
    this.setState({
      previewImgs: images,
      activeIndex: index,
      visible: true
    })

  }
  //删除图片
  removeImg = (e,pic) => {
    e.stopPropagation()
    const img = [...this.state.pictures]
    const index = img.indexOf(pic)
    if ( index> -1) {
      img.splice(index,1)
      this.setState({
        pictures: img
      })
    }
  }
  setBanner() {
    const params = {
      imageUrls: this.state.pictures
    }
    post('', 'setBanner', params).then(res=>{
      if (res.result) {
        message.success('设置成功')
      }
    })
  }

  render() {
    const {pictures, visible, previewImgs, activeIndex,
      } = this.state

    return (
      <div className='banner-manage-page'>
        <Upload name="scenicPic"
          // listType="picture"
                accept='image/*'
                beforeUpload={(e) =>this.beforeUpload(e)}
        >
          <Button>
            <Icon type="upload" />点击上传
          </Button>
          {/*<span>&nbsp;&nbsp;&nbsp;&nbsp;(每张图片尺寸最好保持一致)</span>*/}
        </Upload>
        <div className="clear">
          {
            pictures.map((pic,index)=> <PicWrap src={pic}
                                                key={pic}
                                                remove={(e)=>this.removeImg(e,pic)}
                                                previewImage={()=>this.previewImage(pictures,index)}
            />)
          }
        </div>
        {
          pictures.length?<div style={{marginTop:'20px',textAlign:'center'}}>
            <Button type='primary' onClick={()=>this.setBanner()}>保存</Button>
          </div>:null
        }


        <Viewer
          visible={visible}
          onClose={() => { this.setState({visible: false}) } }
          images={previewImgs}
          activeIndex={activeIndex}
          drag={false}
          zoomable={false}
          scalable={false}
          downloadable={false}
          attribute={false}
          noNavbar={true}
        />
      </div>
    )
  }
}

export default BannerManage