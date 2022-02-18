<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <route-view></route-view>
      <div class="footer">
        <div class="copyright">
          天津卫生人才网
          天津市医学考试中心
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {}
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background-color: #ffffff;
      /*background-attachment: fixed;
      background-size: cover;*/
      //padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }
      .left{
        position: relative;
      }

      .top {
        text-align: center;

        .header {
          height: 70px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 26px;
            color: rgba(0, 0, 0, .85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 40%;
        min-width: 824px;
        width: 824px;
        height: 500px;
        margin: -250px 0 0 -412px;
      }

      .footer {
        position: absolute;
        width: 100%;
        //top: 422px;
        bottom: 0;
        left:0;
        right:0;
        //padding: 0 16px;
        height:500px;
        //z-index: 2;
        background-color: #cef0ff;
        background-image: url("~@/assets/css/newbg2.png");
        backdrop-filter: opacity(0.3%);
        background-repeat: no-repeat;
        background-position: bottom center;
        /*margin: 48px 0 24px;*/
        text-align: center;

        .copyright {
          position: absolute;
          width: 100%;
          top: 300px;
          color: #666666;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
</style>
