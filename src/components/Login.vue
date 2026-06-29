<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="@/assets/shopee-seeklogo.svg" class="login-icon" alt="Shopee" />
        <h1 class="login-title">Shopee跨境电商企业管理系统</h1>
        <p class="login-subtitle">请登录您的账号</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">账号</label>
          <input
            id="username"
            v-model.trim="username"
            type="text"
            placeholder="请输入账号"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="!username || !password">
          登 录
        </button>
      </form>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers } from '../utils/storage.js'

const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')

const departmentRouteMap = {
  '管理部': '/employees',
  '业务部': '/customers',
  '产品部': '/products',
  '售后部': '/tickets'
}

function handleLogin() {
  errorMsg.value = ''

  if (!username.value || !password.value) {
    errorMsg.value = '请输入账号和密码'
    return
  }

  const users = getUsers()
  const user = users.find(
    u => u.username === username.value && u.password === password.value
  )

  if (!user) {
    errorMsg.value = '账号或密码错误'
    return
  }

  localStorage.setItem('shopee_current_user', JSON.stringify(user))

  const targetPath = departmentRouteMap[user.department] || '/employees'
  router.push(targetPath)
}
</script>

<style src="@/styles/Login.css" scoped></style>
