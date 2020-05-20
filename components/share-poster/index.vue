<template>
	<canvas class="canvas-wrap" :canvas-id="CanvasID" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"></canvas>
</template>

<script>
	export default {
		props: {
			CanvasID:{		// canvas-id
				type:String,
				default:'sharePoster'
			},
			cWidth: {
				type: Number,
				default: 375
			},
			avatar: {  //用户头像
				type: String,
				default: ''
			},
			userName: {  //用户名
				type: String,
				default: ''
			},
			time: {			//发布时间
				type: String,
				default: ''
			},
			desc:{			//文本描述
				Type:String,
				default:''
			},
			imgSrc:{		//展示图列表
				type: Array,
				default:()=>[]
			},
			QrSrc:{			//二维码地址
				Type:String,
				default:''
			}
		},
		data() {
			return {
				canvasW: 0,  //canvas宽度
				canvasH: 0,	//canvas高度
				ctx:null
			}
		},
		methods: {
			async generatePoster() {
				uni.showLoading({
				    title: '生成海报中'
				});
				await this.initCanvas()
			},
			async initCanvas() {
				this.ctx = uni.createCanvasContext(this.CanvasID,this) //创建canvas绘图上下文
				this.canvasWidth = this.cWidth //canvas宽度
				this.canvasW = this.canvasWidth
				const line = Math.floor(this.imgSrc.length/3)
				this.canvasH = uni.upx2px(800)+uni.upx2px(215)*line
				this.canvasPadding = uni.upx2px(30); //canvas Paddng 间距
				this.contentWidth = this.canvasWidth - this.canvasPadding*2
				this.cHeight = uni.upx2px(60)  //绘制内容距顶部高度
				let strlineWidth = 0; //文本宽度
				this.ctx.setFillStyle('#FFFFFF'); //canvas背景颜色
				this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasH); //canvas画布大小
				await this.drwaUserInfo()
				await this.drawDesc()
				await this.drawSightImg()
				await this.drawQrCode()
			},
			async drwaUserInfo() {
				//绘制圆形头像
				const avatarWidth = uni.upx2px(86) //绘制头像的宽高
				const imgPath = await this.getImageInfo(this.avatar) //先通过uni.getImageInfo获取图片缓存信息，直接使用this.avatar绘制无效
				this.drawCircleImg(this.canvasPadding,this.canvasPadding,avatarWidth/2, imgPath)

				this.ctx.setFontSize(uni.upx2px(28));//设置标题字体大小
				// this.ctx.font=`normal bold ${parseInt(uni.upx2px(28))}px sans-serif`//设置标题字体大小 //真机上设置加粗后无法再变细
				this.ctx.setFillStyle('#333333'); //设置标题文本颜色
				this.ctx.fillText(this.userName, this.canvasPadding + avatarWidth + 10, this.cHeight+8)
	
				// this.ctx.font=`normal normal ${parseInt(uni.upx2px(22))}px sans-serif`
				this.ctx.setFontSize(uni.upx2px(22))
				this.ctx.setFillStyle('#8e939c'); //设置标题文本颜色
				this.ctx.fillText(this.time, this.canvasPadding + avatarWidth + 10, this.cHeight+23)
				this.cHeight += avatarWidth +10
			},
			drawCircleImg(x,y,r,src) {
				this.ctx.save() // 先保存状态 已便于画完圆再用
				this.ctx.beginPath() //开始绘制
				//先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
				this.ctx.arc(r+x, r+y , r, 0, Math.PI * 2, false)
				this.ctx.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
				// 推进去图片，必须是https图片
				this.ctx.drawImage(src, x, y, 2*r, 2*r);
				this.ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
			},
			//设置文本描述
			async drawDesc() {
				this.ctx.setFontSize(uni.upx2px(26)); //设置标题字体大小
				this.ctx.setFillStyle('#333333'); //设置标题文本颜色
				let strLastIndex = 0; //每次开始截取的字符串的索引
				let strLineWidth = 0	//单行文本宽度
				let num=1; //文本行数
				for (let i = 0; i < this.desc.length; i++) {
					const wordWidth = this.ctx.measureText(this.desc[i]).width
					if (i == this.desc.length - 1) {
						this.ctx.fillText(this.desc.substring(strLastIndex, i + 1), this.canvasPadding, this.cHeight);
						strLineWidth = 0;
					} else {
						if (strLineWidth + wordWidth >= this.contentWidth) {
							if (num == 3) {
								//超过3行进行省略号处理
								this.ctx.fillText(this.desc.substring(strLastIndex, i-3)+'...', this.canvasPadding, this.cHeight);
								strLineWidth = 0;
								strLastIndex = i;
								num++;
								break;
							} else {
								console.log(strLineWidth + wordWidth, 123465789,this.contentWidth)
								this.ctx.fillText(this.desc.substring(strLastIndex, i), this.canvasPadding, this.cHeight);
								strLineWidth = 0;
								this.cHeight += 20;
								strLastIndex = i;
								num++;
							}
						} else {
							strLineWidth += wordWidth
						}
					}
				}
				
			},
			//绘制风景图片
			async drawSightImg() {
				this.cHeight += 10;
				const imgWidth = uni.upx2px(215)
				let width = 0, 
				line = 1,
				marginBottom = uni.upx2px(20)
				for (let i = 0; i < this.imgSrc.length; i++) {
					line = Math.floor(i/3)+1  //012 345 678 
					console.log(line, 8888)
					let marginRight = uni.upx2px(20), x, y
					/* if (i ===0 || i=== this.imgSrc.length-1) {
						marginRight = 0
					} else {
						marginRight = uni.upx2px(20)
					} */
					if (width + imgWidth > this.contentWidth) {
						x = this.canvasPadding
						width = 0
					} else {
						const index = i-(line-1)*3
						console.log(index, i,999)
						x = this.canvasPadding + imgWidth*index + marginRight*index
						width+=x
					}
					y = this.cHeight + (line-1)*imgWidth + (line-1)*marginBottom
					const src = await this.getImageInfo(this.imgSrc[i])
					this.ctx.drawImage(src, x, y, imgWidth, imgWidth);
				}
				this.cHeight += line*imgWidth + line*marginBottom
			},
			async drawQrCode() {
				const imgWidth = uni.upx2px(180)
				const x = (this.canvasWidth - imgWidth)/2
				console.log(this.cHeight, '---cHeight')
				const y = this.cHeight
				const src = await this.getImageInfo(this.QrSrc)
				//TODO
				this.drawCircleImg(x,y,imgWidth/2, this.QrSrc)
				this.ctx.font=`normal normal ${uni.upx2px(24)}px serial`
				this.ctx.setFillStyle('#8e939c'); //设置标题文本颜色
				this.ctx.fillText('长按可识别小程序码', uni.upx2px(270), this.cHeight+imgWidth+uni.upx2px(30));
				this.ctx.draw(true,(ret)=>{
					uni.hideLoading();
					this.getNewImage()
				});
			},
			//获取图片信息
			async getImageInfo(imgSrc) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgSrc,
						success: function(image) {
							resolve(image.path);
						},
						fail(err) {
							reject(err);
						}
					})
				})
			},
			//将画布内容导出为图片
			getNewImage(){
				console.log(1324657777,this.CanvasID)
				uni.canvasToTempFilePath({
					canvasId: this.CanvasID,
					quality: 1,
					fail() {
						console.log('fail')
					},
					complete: (res) => {
						console.log(res.tempFilePath);
						this.$emit('success',res.tempFilePath);
					}
				},this);
			}
		}
	}
</script>

<style lang="less">
	.canvas-wrap {
		position: fixed;
		top: 0;
		left: 0;
		transform: translateX(-100%);
	}
</style>
