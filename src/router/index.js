import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    meta: { requiresAuth: true },
    redirect: '/employees',
    children: [
      {
        path: 'employees',
        name: 'Employees',
        component: () => import('@/components/Employees.vue'),
        meta: { departments: ['管理部'], title: '员工管理' }
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/components/Customers.vue'),
        meta: { departments: ['业务部', '管理部'], title: '客户管理' }
      },
      {
        path: 'contracts',
        name: 'Contracts',
        component: () => import('@/components/Contracts.vue'),
        meta: { departments: ['业务部', '管理部'], title: '合同管理' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/components/Products.vue'),
        meta: { departments: ['产品部', '管理部'], title: '产品管理' }
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('@/components/Tickets.vue'),
        meta: { departments: ['售后部', '管理部'], title: '售后管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('shopee_current_user')
  const isLoggedIn = !!userStr

  if (!isLoggedIn && to.path !== '/login') {
    return next('/login')
  }

  if (isLoggedIn && to.path === '/login') {
    try {
      const user = JSON.parse(userStr)
      const departmentRouteMap = {
        '管理部': '/employees',
        '业务部': '/customers',
        '产品部': '/products',
        '售后部': '/tickets'
      }
      return next(departmentRouteMap[user.department] || '/employees')
    } catch {
      return next('/employees')
    }
  }

  if (isLoggedIn && to.meta.departments) {
    try {
      const user = JSON.parse(userStr)
      if (!to.meta.departments.includes(user.department)) {
        alert('抱歉，您无权访问该模块！')
        return next(false)
      }
    } catch {
      return next('/login')
    }
  }

  next()
})

export default router
