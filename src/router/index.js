// import Vue from 'vue'
import { createRouter, createWebHistory }  from 'vue-router'
// import { constantRouterMap, superiorSkillRouter, professorFromRouter, professionalSkillRouter, baseApplyRouter } from '@/config/router.config'

//  const Router = createRouter({})
// hack router push callback
console.log('createRouter',createRouter);
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   // console.log('Router prototype push:', location, onResolve, onReject)
//   if (onResolve || onReject) { return originalPush.call(this, location, onResolve, onReject) }
//   return originalPush.call(this, location).catch(err => err)
// }
// console.log('process.env.BASE_URL', process.env.BASE_URL)
// Vue.use(Router)

// const routerArr = [...constantRouterMap, ...superiorSkillRouter, ...professorFromRouter, ...professionalSkillRouter, ...baseApplyRouter]

// export default new Router({
//   mode: 'history',
//   base: '/system/', // process.env.BASE_URL,
//   scrollBehavior: () => ({ y: 0 }),
//   routes: routerArr
// })

export default createRouter({
  history: createWebHistory(),
  routes: [],
})