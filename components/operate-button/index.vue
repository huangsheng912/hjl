<template>
	<view class="operate-btn-wrap">
		<button v-if="type==='share'" type="default" open-type="share" :data-info="shareItem">
			<slot></slot>
		</button>
		<button v-else type="default" open-type="getUserInfo" @getuserinfo="getUserInfo" >
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		props: {
			type:{
				type: String,
				default: 'share'
			},
			shareItem: {
				type: Object,
				default: ()=>{}
			}
		},
		methods: {
			getUserInfo(e) {
				this.$emit('getUserInfo', e)
			},
		}
		
	}
</script>

<style lang="less" scoped>
	.operate-btn-wrap {
		button {
			padding: 0;
			text-align: left;
			color: #333!important;
			background: transparent!important;
			line-height: 0;
			&::after {
				border: none;
			}
		}
	}
</style>
