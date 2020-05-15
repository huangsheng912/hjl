<template>
	<view class="hot-sights">
		<area-search @change="changeArea"></area-search>
		<view class="sight-list" v-for="item in sights" :key="item.id" >
			<image src="../../static/img/footPrint.png" mode=""></image>
			<view class="sight-info flex">
				<view class="info-title" @click="toDetail(item.id,item.name)">{{item.title}}</view>
				<view class="info-desc" @click="toDetail(item.id,item.name)">{{item.desc}}</view>
				<view class="info-bottom">
					<view class="fr">{{item.see}} <text class="iconfont icon-chakan"></text></view>
					<view class="fr" @click="toggleLike(item.id)"><text class="iconfont" :class="item.isLike?'icon-heart-fill':'icon-heart'"></text> {{item.like}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import areaSearch from '@/components/area-search/index.vue'
	import {post} from '@/utils/http.js'
	export default {
		data() {
			return {
				sights: []
			}
		},
		components:{
			areaSearch
		},
		created() {
			this.getHotSights()
		},
		methods: {
			changeArea(e) {
				console.log(e)
				
			},
			getHotSights() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				setTimeout(()=>{
					this.sights = [
						{
							id:1,
							name:'洪崖洞民宿风貌区',
							title: '如何玩转“网红”重庆？',
							desc: '坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。',
							location: '重庆',
							like: '213',
							isLike: 0,
							see: '2090'
						},
						{
							id:2,
							name:'洪崖洞民宿区',
							title: '如何玩转“网红”重庆？重庆自由行攻略',
							desc: '坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。',
							location: '重庆',
							like: '214',
							isLike: 1,
							see: '2090'
						},
						{
							id:3,
							name:'洪崖洞民宿风貌',
							title: '如何玩转“网红”重庆？重庆自由行攻略',
							desc: '坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。',
							location: '重庆',
							like: '215',
							isLike: 0,
							see: '2090'
						}
					]
					uni.hideLoading()
				},1500)
			},
			toggleLike(id) {
				this.sights.forEach(v => {
					if (v.id === id) {
						v.isLike = !v.isLike
					}
				})
			},
			toDetail(id, name) {
				uni.navigateTo({
					url:`/pages/sightsDetail/index?id=${id}&name=${name}`,
				})
			}
		}
	}
</script>

<style lang="less">
	.hot-sights {
		.sight-list {
			.info-bottom {
				.fr:last-of-type {
					margin-right: 44rpx;
					.icon-heart-fill {
						color: #fa6464;
					}
				}
			}
		}
	}
</style>
