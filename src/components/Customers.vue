<template>
  <div class="customers-page">
    <div class="card">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="search-area">
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="输入客户姓名查询"
          />
          <button class="btn btn-default" @click="resetSearch">重置</button>
          <select v-if="isAdmin" v-model="filterSalesperson" class="filter-select">
            <option value="">全部业务员</option>
            <option v-for="s in salespersonList" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="openAddModal">+ 添加客户</button>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>客户姓名</th>
              <th>联系电话</th>
              <th>收货地址</th>
              <th>电子邮箱</th>
              <th>业务员</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="6" class="empty-row">暂无数据</td>
            </tr>
            <tr v-for="item in pagedCustomers" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.salesperson }}</td>
              <td>
                <button class="btn-link" @click="openEditModal(item)">修改</button>
                <button class="btn-link btn-link-danger" @click="confirmDelete(item)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="btn btn-default btn-page" :disabled="currentPage <= 1" @click="prevPage">上一页</button>
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="btn btn-default btn-page" :disabled="currentPage >= totalPages" @click="nextPage">下一页</button>
      </div>
    </div>

    <!-- 添加/修改客户 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEditing ? '修改客户信息' : '添加客户' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form class="modal-body" @submit.prevent="saveCustomer">
          <div class="form-row">
            <div class="form-group">
              <label>客户姓名 <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="请输入客户姓名" required />
            </div>
            <div class="form-group">
              <label>联系电话 <span class="required">*</span></label>
              <input v-model="form.phone" type="text" placeholder="请输入联系电话" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>收货地址 <span class="required">*</span></label>
              <input v-model="form.address" type="text" placeholder="请输入收货地址" required />
            </div>
            <div class="form-group">
              <label>电子邮箱 <span class="required">*</span></label>
              <input v-model="form.email" type="email" placeholder="请输入电子邮箱" required />
            </div>
          </div>
          <template v-if="isAdmin">
            <div class="form-row">
              <div class="form-group">
                <label>分配业务员 <span class="required">*</span></label>
                <select v-model="form.salesperson" required>
                  <option value="">请选择业务员</option>
                  <option v-for="emp in businessEmployees" :key="emp.id" :value="emp.name">
                    {{ emp.name }}
                  </option>
                </select>
              </div>
              <div class="form-group" />
            </div>
          </template>
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
import { ref, computed, onMounted, watch } from 'vue'
import { getCustomers, saveCustomers, getUsers } from '../utils/storage.js'

const userStr = localStorage.getItem('shopee_current_user')
let currentUserData = userStr ? JSON.parse(userStr) : null

const currentUser = currentUserData
const isAdmin = currentUser?.department === '管理部'

const allCustomers = ref([])   // 全部客户
const displayedCustomers = ref([])  // 当前业务员可见的客户

// 所有员工
const allEmployees = ref([])
const businessEmployees = computed(() =>
  allEmployees.value.filter(e => e.department === '业务部')
)
const searchKeyword = ref('')
const filterSalesperson = ref('')

const pageSize = 10
const currentPage = ref(1)

const pagedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCustomers.value.slice(start, start + pageSize)
})
const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / pageSize) || 1)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const defaultForm = () => ({
  name: '',
  phone: '',
  address: '',
  email: '',
  salesperson: ''
})

const form = ref(defaultForm())

// 可选的业务员列表
const salespersonList = computed(() => {
  const names = [...new Set(displayedCustomers.value.map(c => c.salesperson).filter(Boolean))]
  return names.sort()
})

const filteredCustomers = computed(() => {
  let result = displayedCustomers.value

  // 按业务员筛选
  if (filterSalesperson.value) {
    result = result.filter(c => c.salesperson === filterSalesperson.value)
  }

  // 按关键字搜索
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    result = result.filter(c => c.name.toLowerCase().includes(keyword))
  }

  return result
})

onMounted(() => {
  loadCustomers()
  loadEmployees()
})

function loadCustomers() {
  const all = getCustomers()
  allCustomers.value = all

  if (isAdmin) {
    displayedCustomers.value = all
  } else if (currentUser) {
    displayedCustomers.value = all.filter(c => c.salesperson === currentUser.name)
  } else {
    displayedCustomers.value = []
  }
}

function loadEmployees() {
  allEmployees.value = getUsers()
}

watch([searchKeyword, filterSalesperson], () => {
  currentPage.value = 1
})

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  if (!isAdmin && currentUser) {
    form.value.salesperson = currentUser.name
  }
  showModal.value = true
}

function openEditModal(item) {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    name: item.name,
    phone: item.phone,
    address: item.address,
    email: item.email,
    salesperson: item.salesperson
  }
  showModal.value = true
}

function saveCustomer() {
  const data = {
    id: isEditing.value ? editingId.value : 'cust_' + Date.now(),
    name: form.value.name,
    phone: form.value.phone,
    address: form.value.address,
    email: form.value.email,
    salesperson: form.value.salesperson || (currentUser ? currentUser.name : '')
  }

  if (isEditing.value) {
    const index = allCustomers.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      allCustomers.value[index] = data
    }
  } else {
    allCustomers.value.push(data)
  }

  saveCustomers(allCustomers.value)
  loadCustomers()
  showModal.value = false
  alert(isEditing.value ? '修改成功' : '添加成功')
}

function confirmDelete(item) {
  const input = prompt(`确定要删除客户「${item.name}」吗？请输入该客户姓名确认：`)
  if (input === null) return

  if (input.trim() !== item.name) {
    alert('客户姓名输入不匹配，取消删除')
    return
  }

  allCustomers.value = allCustomers.value.filter(c => c.id !== item.id)
  saveCustomers(allCustomers.value)
  loadCustomers()
  alert('删除成功')
}

function resetSearch() {
  searchKeyword.value = ''
  filterSalesperson.value = ''
  currentPage.value = 1
}

function closeModal() {
  showModal.value = false
}
</script>

<style src="@/styles/Customers.css" scoped></style>
