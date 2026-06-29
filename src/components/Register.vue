<template>
   <div class="login-container">
      <div class="login-card">
         <div class="login-header">
            <img
               src="@/assets/shopee-seeklogo.svg"
               class="login-icon"
               alt="Shopee"
            />
            <h1 class="login-title">管理员注册</h1>
            <p class="login-subtitle">注册第一个管理员账号</p>
         </div>

         <form class="login-form" @submit.prevent="handleRegister">
            <div class="form-group">
               <label for="username">账号</label>
               <input
                  id="username"
                  v-model.trim="form.username"
                  type="text"
                  placeholder="请输入账号"
                  autocomplete="username"
                  required
               />
            </div>

            <div class="form-group">
               <label for="password">密码</label>
               <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  autocomplete="new-password"
                  required
               />
            </div>

            <div class="form-group">
               <label for="confirmPassword">确认密码</label>
               <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  autocomplete="new-password"
                  required
               />
            </div>

            <div class="form-group">
               <label for="name">姓名</label>
               <input
                  id="name"
                  v-model.trim="form.name"
                  type="text"
                  placeholder="请输入姓名"
                  required
               />
            </div>

            <div class="form-row">
               <div class="form-group form-group-half">
                  <label for="gender">性别</label>
                  <select id="gender" v-model="form.gender" required>
                     <option value="" disabled>请选择</option>
                     <option value="男">男</option>
                     <option value="女">女</option>
                  </select>
               </div>

               <div class="form-group form-group-half">
                  <label for="age">年龄</label>
                  <input
                     id="age"
                     v-model.number="form.age"
                     type="number"
                     min="18"
                     max="100"
                     placeholder="年龄"
                     required
                  />
               </div>
            </div>

            <div class="form-group">
               <label for="education">学历</label>
               <select id="education" v-model="form.education" required>
                  <option value="" disabled>请选择学历</option>
                  <option value="高中">高中</option>
                  <option value="大专">大专</option>
                  <option value="本科">本科</option>
                  <option value="硕士">硕士</option>
               </select>
            </div>

            <div class="form-group">
               <label for="department">部门</label>
               <select id="department" v-model="form.department" required>
                  <option value="" disabled>请选择部门</option>
                  <option value="管理部">管理部</option>
                  <option value="业务部">业务部</option>
                  <option value="产品部">产品部</option>
                  <option value="售后部">售后部</option>
               </select>
            </div>

            <div class="form-group">
               <label for="position">职位</label>
               <input
                  id="position"
                  v-model.trim="form.position"
                  type="text"
                  placeholder="请输入职位，如：经理"
                  required
               />
            </div>

            <div class="form-group">
               <label for="hireDate">入职日期</label>
               <input
                  id="hireDate"
                  v-model="form.hireDate"
                  type="date"
                  :max="today"
                  required
               />
            </div>

            <button type="submit" class="login-btn" :disabled="!isFormValid">
               注 册
            </button>
         </form>

         <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

         <p class="register-link">
            已有账号？
            <router-link to="/login">去登录</router-link>
         </p>
      </div>
   </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getUsers, saveUsers } from '../utils/storage.js';

const router = useRouter();

const today = new Date().toISOString().split('T')[0];

const form = reactive({
   username: '',
   password: '',
   confirmPassword: '',
   name: '',
   gender: '',
   age: '',
   education: '',
   department: '',
   position: '',
   hireDate: '',
});

const errorMsg = ref('');

const isFormValid = computed(() => {
   return (
      form.username &&
      form.password &&
      form.confirmPassword &&
      form.name &&
      form.gender &&
      form.age &&
      form.education &&
      form.department &&
      form.position &&
      form.hireDate
   );
});

function handleRegister() {
   errorMsg.value = '';

   if (form.password !== form.confirmPassword) {
      errorMsg.value = '两次输入的密码不一致';
      return;
   }

   const users = getUsers();
   if (users.some((u) => u.username === form.username)) {
      errorMsg.value = '该账号已被注册';
      return;
   }

   if (form.hireDate > today) {
      errorMsg.value = '入职日期不能是未来的日期';
      return;
   }

   const newUser = {
      id: crypto.randomUUID(),
      username: form.username,
      password: form.password,
      role: 'admin',
      name: form.name,
      gender: form.gender,
      age: form.age,
      education: form.education,
      department: form.department,
      hireDate: form.hireDate,
      position: form.position,
   };

   saveUsers([...users, newUser]);

   localStorage.setItem('shopee_current_user', JSON.stringify(newUser));

   router.push('/employees');
}
</script>

<style src="@/styles/Register.css" scoped></style>
