<template>
  <a-layout>
    <global-header
      class="topBar"
      :mode="layoutMode"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :device="device"
      @toggle="toggle"
      @menuChange="menuChange"
    />
    <!--v-if="sidebarShow == 'system' && routePath == '/welcome'"-->
    <a-layout class="bannerContent" v-if="sidebarShows == 'system' || sidebarShows == 'office'">
      <a-layout-content
        :style="{ height: '100%', overflow: 'auto', backgroundColor: '#fff', margin: '15px 15px 0', paddingTop: fixedHeader ? '64px' : '0' }">
        <multi-tab v-if="multiTab"></multi-tab>
        <transition name="page-transition">
          <route-view/>
        </transition>
      </a-layout-content>
    </a-layout>
    <a-layout class="bannerContent" v-else>
      <a-drawer
        v-if="isMobile()"
        placement="left"
        :wrapClassName="`drawer-sider ${navTheme}`"
        :closable="false"
        :visible="collapsed"
        @close="drawerClose"
      >
        <side-menu
          mode="inline"
          :menus="menus"
          :theme="navTheme"
          :collapsed="false"
          :collapsible="true"
          @menuSelect="menuSelect"
        ></side-menu>
      </a-drawer>
      <side-menu
        v-else-if="isSideMenu()"
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :collapsible="true"
      ></side-menu>
      <a-layout-content
        style="background-color: #fff;"
        :style="{ margin: '15px 15px 0', paddingTop: fixedHeader ? '64px' : '0' }">
        <multi-tab v-if="multiTab"></multi-tab>
        <transition name="page-transition">
          <route-view/>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions, mapGetters } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'
import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { convertRoutes } from '@/utils/routeConvert'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data () {
    return {
      production: config.production,
      collapsed: false,
      menus: [],
      routePath: '',
      sidebarShows: 'system' // 'system'自主招聘，‘office’报名考试，‘hasMenus’显示左侧菜单
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '80px'
    },
    ...mapGetters(['sidebarShow'])
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    },
    // 菜单变化
    mainMenu (val) {
      setTimeout(() => {
        this.setMenus('change')
      }, 100)
    }
  },
  created () {
    this.setMenus('default')
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    // 重新生成
    setMenus (state) {
      const routes = convertRoutes(this.mainMenu.find(item => item.path === '/'))
      this.menus = (routes && routes.children) || []
      this.sidebarShows = this.sidebarShow
      // if (this.sidebarShows === 'business') {
      //   const currentRoute = this.menus[0].path
      //   this.$router.push({ path: currentRoute })
      // }
      this.routePath = this.$route.path
      if (state === 'change' || this.$route.path !== '/welcome') {
        this.sidebarShows = 'hasMenus'
      }
      if (this.$route.path === '/examinationRegistration') {
        this.sidebarShows = 'system'
      }
      // if (state === 'change' || this.$route.path !== '/welcome') {
      //   this.sidebarShows = 'hasMenus'
      // }
    },
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    menuChange (code) {
      this.sidebarShows = code
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    menuSelect () {
    },
    drawerClose () {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.topBar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 160;
}

.bannerContent {
  position: absolute;
  top: 64px;
  width: 100%;
  z-index: 140;
  bottom: 0;
}

.sider {
  height: 100% !important;
  background-color: #fff !important;

  .logo {
    background-color: #fff !important;

    h1 {
      color: #666666 !important;
    }
  }
}

.ant-menu-dark, .ant-menu-dark .ant-menu-sub {
  background-color: #fff !important;
  color: #666666 !important;
}

.ant-menu-dark .ant-menu-item:hover {
  color: #000 !important;
}

.ant-menu-dark .ant-menu-item, .ant-menu-dark .ant-menu-item-group-title, .ant-menu-dark .ant-menu-item > a {
  color: #666666 !important;
}

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
