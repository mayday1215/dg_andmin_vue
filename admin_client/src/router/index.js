import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决路由访问重复时报错问题：
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")
const Users = () => import("views/users/Users")
const Roles = () => import("views/roles/Roles")
const Rights = () => import("views/rights/Rights")
const Goods = () => import("views/goods/Goods")
const Params = () => import("views/params/Params")
const Categories = () => import("views/categories/Categories")
const Orders = () => import("views/orders/Orders")
const Reports = () => import("views/reports/Reports")
const GoodsAdd = () => import("views/goodsAdd/GoodsAdd")

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {path: "/home",
      component: Home,
      redirect: '/users',
      children: [
        {path:'/users',component:Users,name:'Users'},
        {path:'/roles',component:Roles,name:'Roles'},
        {path:'/rights',component:Rights,name:'Rights'},
        {path:'/goods',component:Goods,name:'Goods'},
        {path:'/goods/add',component:GoodsAdd,name:'GoodsAdd'},
        {path:'/params',component:Params,name:'Params'},
        {path:'/categories',component:Categories,name:'Categories'},
        {path:'/orders',component:Orders,name:'Orders'},
        {path:'/reports',component:Reports,name:'Reports'}
      ]
    },
    {path: "/login", component: Login,name:'Login'},
    {path: "/", redirect: '/login'},
  ]
})

router.beforeEach((to, from, next) => {
  const {path} = to
  if (path === "/login" || sessionStorage.getItem("token")) {
    next()
  } else {
    next("/login")
  }


})

export default router
