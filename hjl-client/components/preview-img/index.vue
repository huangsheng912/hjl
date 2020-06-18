<template>
	<view class="preview-wrap" @click.stop="previewImg">
		<image class="img" :src="url" mode="scaleToFill"></image>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props:{
			url:String,
			urlList:{
				type: Array,
				default: ()=>[]
			},
		},
		methods: {
			previewImg() {
				// console.log( this.url,this.urlList)
				uni.previewImage({
					current: this.url,
					urls:	this.urlList,
					success(s) {
						// console.log(s,1)
					},
					fail(e) {
						// console.log(e,2)
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.preview-wrap {
		width: 215rpx;
		height: 215rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
		.img {
			width: 100%;
			height: 100%;
		}
	}
</style>
