<template>
  <div>
    <route-view></route-view>
  </div>
</template>

<script>
  import RouteView from './RouteView'
  import { mixinDevice } from '@/utils/mixin'

  export default {
    name: 'PrintTempLayout',
    components: { RouteView },
    mixins: [mixinDevice]
  }
</script>

<style scoped>

</style>
