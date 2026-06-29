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
          <span class="user-info" @click="openProfile" style="cursor:pointer">
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

    <!-- 个人信息弹窗 -->
    <div v-if="showProfile" class="modal-overlay" @click.self="closeProfile">
      <div class="modal-card profile-modal">
        <div class="modal-header">
          <h3>个人信息</h3>
          <button class="modal-close" @click="closeProfile">&times;</button>
        </div>
        <div class="modal-body">
          <table class="profile-table">
            <tr><td class="profile-label">姓名</td><td>{{ user.name }}</td></tr>
            <tr><td class="profile-label">性别</td><td>{{ user.gender }}</td></tr>
            <tr><td class="profile-label">年龄</td><td>{{ user.age }}</td></tr>
            <tr><td class="profile-label">学历</td><td>{{ user.education }}</td></tr>
            <tr><td class="profile-label">部门</td><td>{{ user.department }}</td></tr>
            <tr><td class="profile-label">职务</td><td>{{ user.position }}</td></tr>
            <tr><td class="profile-label">入职时间</td><td>{{ user.hireDate }}</td></tr>
            <tr><td class="profile-label">工资</td><td>{{ user.salary }}</td></tr>
            <tr><td class="profile-label">用户名</td><td>{{ user.username }}</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userStr = localStorage.getItem('shopee_current_user')
let userData = userStr ? JSON.parse(userStr) : {}

const user = ref(userData)
const showProfile = ref(false)

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

function openProfile() {
  showProfile.value = true
}

function closeProfile() {
  showProfile.value = false
}
</script>

<style src="@/styles/Layout.css" scoped></style>
