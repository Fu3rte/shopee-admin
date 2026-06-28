<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo-area">
        <img src="@/assets/shopee-seeklogo.svg" class="logo-icon" alt="Shopee" />
        <span class="logo-text">Shopee 管理系统</span>
      </div>
      <nav class="menu">
        <template v-if="user.department === '管理部'">
          <router-link to="/employees" class="menu-item">
            <span class="menu-icon">👥</span>
            <span>员工管理</span>
          </router-link>
        </template>

        <template v-if="user.department === '管理部' || user.department === '业务部'">
          <router-link to="/customers" class="menu-item">
            <span class="menu-icon">🤝</span>
            <span>客户管理</span>
          </router-link>
          <router-link to="/contracts" class="menu-item">
            <span class="menu-icon">📄</span>
            <span>合同管理</span>
          </router-link>
        </template>

        <template v-if="user.department === '管理部' || user.department === '产品部'">
          <router-link to="/products" class="menu-item">
            <span class="menu-icon">📱</span>
            <span>产品管理</span>
          </router-link>
        </template>

        <template v-if="user.department === '管理部' || user.department === '售后部'">
          <router-link to="/tickets" class="menu-item">
            <span class="menu-icon">🎫</span>
            <span>售后管理</span>
          </router-link>
        </template>
      </nav>
    </aside>

    <div class="main-area">
      <header class="header">
        <div class="header-left">
          <span class="header-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <span class="user-info">
            <span class="user-avatar">👤</span>
            <span class="user-name">{{ user.name }}</span>
            <span class="user-position">（{{ user.position }}）</span>
          </span>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userStr = localStorage.getItem('shopee_current_user')
const user = ref(userStr ? JSON.parse(userStr) : {})

// 页面标题映射
const titleMap = {
  '/employees': '员工管理',
  '/customers': '客户管理',
  '/contracts': '合同管理',
  '/products': '产品管理',
  '/tickets': '售后管理'
}

const pageTitle = computed(() => titleMap[route.path] || 'Dashboard')

function handleLogout() {
  localStorage.removeItem('shopee_current_user')
  router.push('/login')
}
</script>

<style src="@/styles/Layout.css" scoped></style>
