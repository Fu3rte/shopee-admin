<template>
  <div class="employees-page">
    <div class="card">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="search-area">
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="输入员工姓名查询"
            @input="handleSearch"
          />
          <button class="btn btn-primary" @click="handleSearch">查询</button>
        </div>
        <button class="btn btn-primary" @click="openAddModal">+ 添加员工</button>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>性别</th>
              <th>年龄</th>
              <th>学历</th>
              <th>部门</th>
              <th>入职时间</th>
              <th>职务</th>
              <th>工资</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredEmployees.length === 0">
              <td colspan="9" class="empty-row">暂无数据</td>
            </tr>
            <tr v-for="emp in filteredEmployees" :key="emp.id">
              <td>{{ emp.name }}</td>
              <td>{{ emp.gender }}</td>
              <td>{{ emp.age }}</td>
              <td>{{ emp.education }}</td>
              <td>{{ emp.department }}</td>
              <td>{{ emp.hireDate }}</td>
              <td>{{ emp.position }}</td>
              <td>{{ emp.salary }}</td>
              <td>
                <button class="btn-link" @click="openEditModal(emp)">修改</button>
                <button class="btn-link btn-link-danger" @click="confirmDelete(emp)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 添加/修改员工 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEditing ? '修改员工' : '添加员工' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form class="modal-body" @submit.prevent="saveEmployee">
          <div class="form-row">
            <div class="form-group">
              <label>姓名 <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="请输入姓名" required />
            </div>
            <div class="form-group">
              <label>性别 <span class="required">*</span></label>
              <select v-model="form.gender" required>
                <option value="">请选择</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>年龄 <span class="required">*</span></label>
              <input v-model.number="form.age" type="number" min="1" max="120" placeholder="请输入年龄" required />
            </div>
            <div class="form-group">
              <label>学历 <span class="required">*</span></label>
              <select v-model="form.education" required>
                <option value="">请选择</option>
                <option value="高中">高中</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>部门 <span class="required">*</span></label>
              <select v-model="form.department" required @change="onDepartmentChange">
                <option value="">请选择部门</option>
                <option value="管理部">管理部</option>
                <option value="业务部">业务部</option>
                <option value="产品部">产品部</option>
                <option value="售后部">售后部</option>
              </select>
            </div>
            <div class="form-group">
              <label>入职时间 <span class="required">*</span></label>
              <input v-model="form.hireDate" type="date" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>职务 <span class="required">*</span></label>
              <input type="text" :value="form.position" disabled class="auto-field" />
              <input type="hidden" v-model="form.position" required />
            </div>
            <div class="form-group">
              <label>工资 <span class="required">*</span></label>
              <input v-model.number="form.salary" type="number" min="0" step="0.01" placeholder="请输入工资" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>用户名（登录账号） <span class="required">*</span></label>
              <input v-model="form.username" type="text" placeholder="请输入登录用户名" required />
            </div>
            <div class="form-group">
              <label>密码 <span class="required">*</span></label>
              <input v-model="form.password" type="text" placeholder="请输入登录密码" required />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" @click="closeModal">取消</button>
            <button type="submit" class="btn btn-primary">{{ isEditing ? '保存修改' : '确认添加' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUsers, saveUsers } from '../utils/storage.js'

const employees = ref([])
const searchKeyword = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const defaultForm = () => ({
  name: '',
  gender: '',
  age: '',
  education: '',
  department: '',
  hireDate: '',
  position: '',
  salary: '',
  username: '',
  password: ''
})

const form = ref(defaultForm())

// 部门 → 职务自动映射
const departmentPositionMap = {
  '管理部': '系统管理员',
  '业务部': '跨境业务员',
  '产品部': '产品专员',
  '售后部': '售后客服'
}

function onDepartmentChange() {
  form.value.position = departmentPositionMap[form.value.department] || ''
}

const filteredEmployees = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return employees.value
  return employees.value.filter(emp => emp.name.toLowerCase().includes(keyword))
})

onMounted(() => {
  loadEmployees()
})

function loadEmployees() {
  employees.value = getUsers()
}

/* ---- 添加 ---- */
function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  showModal.value = true
}

/* ---- 修改 ---- */
function openEditModal(emp) {
  isEditing.value = true
  editingId.value = emp.id
  form.value = {
    name: emp.name,
    gender: emp.gender,
    age: emp.age,
    education: emp.education,
    department: emp.department,
    hireDate: emp.hireDate,
    position: emp.position,
    salary: emp.salary,
    username: emp.username,
    password: emp.password
  }
  showModal.value = true
}

/* ---- 保存 ---- */
function saveEmployee() {
  const data = {
    id: isEditing.value ? editingId.value : 'emp_' + Date.now(),
    name: form.value.name,
    gender: form.value.gender,
    age: form.value.age,
    education: form.value.education,
    department: form.value.department,
    hireDate: form.value.hireDate,
    position: form.value.position,
    salary: Number(form.value.salary),
    username: form.value.username,
    password: form.value.password
  }

  if (isEditing.value) {
    const index = employees.value.findIndex(e => e.id === editingId.value)
    if (index !== -1) {
      employees.value[index] = data
    }
  } else {
    // 检查用户名是否已存在
    if (employees.value.some(e => e.username === data.username)) {
      alert('该用户名已被使用，请更换')
      return
    }
    employees.value.push(data)
  }

  saveUsers(employees.value)
  showModal.value = false
  alert(isEditing.value ? '修改成功' : '添加成功')
}

/* ---- 删除（输入员工姓名确认） ---- */
function confirmDelete(emp) {
  const input = prompt(`确定要删除员工「${emp.name}」吗？请输入该员工姓名确认：`)
  if (input === null) return

  if (input.trim() !== emp.name) {
    alert('姓名输入不匹配，取消删除')
    return
  }

  employees.value = employees.value.filter(e => e.id !== emp.id)
  saveUsers(employees.value)
  alert('删除成功')
}

function closeModal() {
  showModal.value = false
}
</script>

<style src="@/styles/Employees.css" scoped></style>
