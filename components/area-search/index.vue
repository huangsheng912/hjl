<template>
	<view class="area-search">
		<picker :value="currentArea" :range="areaArr" range-key="name" @change="selectArea">
			<view class="serch-val">{{areaArr[currentArea].name}}<text class="iconfont icon-xiasanjiaoxing"></text></view>
		</picker>
		<view class="search-input">
			<input type="text" v-model="searchVal" confirm-type="search" @confirm="search"/>
			<text class="iconfont icon-sousuo fr"></text>
		</view>
		
	</view>
</template>

<script>
	import province from './province-city'
	const pData = {}
	province.map(v => {
		pData[v.name] = v.code
		const citys = v.cityList
		if (citys.length) {
			citys.map(city => {
				pData[city.name] = city.code
			})
		}
	})
	uni.setStorageSync('province', JSON.stringify(pData))
	
	export default {
		data() {
			return {
				currentArea: 0, //当前选中地区
				areaArr: [{name: '全国', code: ''}],
				searchVal: ''
			}
		},
		created() {
			province.map(v => {
				this.areaArr.push({
					name: v.name,
					code: v.code
				})
			})
		},
		methods: {
			selectArea(e) {
				console.log(e, '8888')
				this.currentArea = e.detail.value
				this.$emit('change', {
					code: this.areaArr[e.detail.value].code,
					val: this.searchVal
				})
			},
			search() {
				console.log(this.searchVal)
				this.$emit('change', {
					code: this.areaArr[this.currentArea].code,
					val: this.searchVal
				})
			}
		}
	}
</script>

<style lang="less">
	.area-search {
		padding: 15rpx 40rpx;
		display: flex;
		.serch-val {
			height: 40rpx;
			padding: 15rpx 0;
			line-height:50rpx;
			font-size:28rpx;
			.iconfont {
				margin: 0 20rpx 0 10rpx
			}
		}
		.search-input {
			flex: 1;
			height: 70rpx;
			border: 1px solid #8e939c;
			border-radius: 70rpx;
			display: flex;
			input {
				background-color: transparent;
				padding: 13rpx 25rpx
			}
			.fr {
				line-height: 74rpx;
				margin-right: 30rpx;
			}
		}
	}
	
</style>
