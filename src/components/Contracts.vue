<template>
  <div class="contracts-page">
    <div class="card">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="search-area">
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="输入合同名称查询"
          />
          <button class="btn btn-default" @click="resetSearch">重置</button>
          <select v-if="isAdmin" v-model="filterSalesperson" class="filter-select">
            <option value="">全部业务员</option>
            <option v-for="s in salespersonList" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="openAddModal">+ 添加合同</button>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>客户姓名</th>
              <th>合同名称</th>
              <th>合同内容</th>
              <th class="sortable" @click="sortBy('startDate')">
                合同生效日期
                <span v-if="sortField === 'startDate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="sortable" @click="sortBy('expiryDate')">
                合同失效日期
                <span v-if="sortField === 'expiryDate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th>状态</th>
              <th>业务员</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredContracts.length === 0">
              <td colspan="8" class="empty-row">暂无数据</td>
            </tr>
            <tr v-for="item in filteredContracts" :key="item.id">
              <td>{{ item.customerName }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.content }}</td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.expiryDate }}</td>
              <td><span :class="'status-tag status-' + getContractStatus(item).toLowerCase()">{{ getContractStatus(item) }}</span></td>
              <td>{{ item.salesperson }}</td>
              <td>
                <button class="btn-link" @click="openEditModal(item)">修改</button>
                <button class="btn-link btn-link-danger" @click="confirmDelete(item)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Modal 弹窗：添加/修改合同 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEditing ? '修改合同' : '添加合同' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form class="modal-body" @submit.prevent="saveContract">
          <div class="form-row">
            <div class="form-group">
              <label>客户姓名 <span class="required">*</span></label>
              <select v-model="form.customerName" required>
                <option value="">请选择客户</option>
                <option v-for="c in myCustomers" :key="c.id" :value="c.name">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>合同名称 <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="请输入合同名称" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>合同内容 <span class="required">*</span></label>
              <textarea v-model="form.content" rows="3" placeholder="请输入合同内容" required></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>合同生效日期 <span class="required">*</span></label>
              <input v-model="form.startDate" type="date" required />
            </div>
            <div class="form-group">
              <label>合同失效日期 <span class="required">*</span></label>
              <input v-model="form.expiryDate" type="date" :min="form.startDate" required />
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
import { ref, computed, onMounted } from 'vue'
import { getContracts, saveContracts, getCustomers, getUsers } from '../utils/storage.js'

// 当前用户
const userStr = localStorage.getItem('shopee_current_user')
const currentUser = userStr ? JSON.parse(userStr) : null
const isAdmin = currentUser?.department === '管理部'

/* ===== 数据 ===== */
const allContracts = ref([])
const displayedContracts = ref([])
const searchKeyword = ref('')
const filterSalesperson = ref('')
const sortField = ref('')
const sortOrder = ref('asc')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// 当前业务员的客户（下拉框用）
const myCustomers = ref([])

// 可选的业务员列表（用于筛选下拉）
const salespersonList = computed(() => {
  const names = [...new Set(displayedContracts.value.map(c => c.salesperson).filter(Boolean))]
  return names.sort()
})

// 所有员工（管理员分配业务员用）
const allEmployees = ref([])
const businessEmployees = computed(() =>
  allEmployees.value.filter(e => e.department === '业务部')
)

const defaultForm = () => ({
  customerName: '',
  name: '',
  content: '',
  startDate: '',
  expiryDate: '',
  salesperson: ''
})

const form = ref(defaultForm())

const filteredContracts = computed(() => {
  let result = displayedContracts.value

  // 按业务员筛选
  if (filterSalesperson.value) {
    result = result.filter(c => c.salesperson === filterSalesperson.value)
  }

  // 按关键字搜索
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    result = result.filter(c => c.name.toLowerCase().includes(keyword))
  }

  // 按日期排序
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      const va = a[sortField.value] || ''
      const vb = b[sortField.value] || ''
      return sortOrder.value === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }

  return result
})

onMounted(() => {
  loadContracts()
  loadMyCustomers()
  loadEmployees()
})

/* ===== 方法 ===== */
function loadContracts() {
  const all = getContracts()
  allContracts.value = all
  if (isAdmin) {
    displayedContracts.value = all
  } else if (currentUser) {
    displayedContracts.value = all.filter(c => c.salesperson === currentUser.name)
  } else {
    displayedContracts.value = []
  }
}

function loadMyCustomers() {
  const all = getCustomers()
  if (isAdmin) {
    myCustomers.value = all
  } else if (currentUser) {
    myCustomers.value = all.filter(c => c.salesperson === currentUser.name)
  } else {
    myCustomers.value = []
  }
}

function loadEmployees() {
  allEmployees.value = getUsers()
}

// 排序切换
function sortBy(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// 根据日期计算合同状态
function getContractStatus(item) {
  if (!item.expiryDate) return '生效中'
  const now = new Date()
  const expiry = new Date(item.expiryDate)
  // 把时间归零到当天0点，比较日期
  now.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)
  return expiry < now ? '已过期' : '生效中'
}

/* ---- 添加 ---- */
function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  if (!isAdmin && currentUser) {
    form.value.salesperson = currentUser.name
  }
  showModal.value = true
}

/* ---- 修改 ---- */
function openEditModal(item) {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    customerName: item.customerName,
    name: item.name,
    content: item.content,
    startDate: item.startDate,
    expiryDate: item.expiryDate,
    salesperson: item.salesperson
  }
  showModal.value = true
}

/* ---- 保存 ---- */
function saveContract() {
  // 校验：失效日期不能早于生效日期
  if (form.value.expiryDate && form.value.startDate && form.value.expiryDate < form.value.startDate) {
    alert('合同失效日期不能早于生效日期，请重新选择')
    return
  }

  const data = {
    id: isEditing.value ? editingId.value : 'ctr_' + Date.now(),
    customerName: form.value.customerName,
    name: form.value.name,
    content: form.value.content,
    startDate: form.value.startDate,
    expiryDate: form.value.expiryDate,
    salesperson: form.value.salesperson || (currentUser ? currentUser.name : '')
  }

  if (isEditing.value) {
    const index = allContracts.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      allContracts.value[index] = data
    }
  } else {
    allContracts.value.push(data)
  }

  saveContracts(allContracts.value)
  loadContracts()
  showModal.value = false
  alert(isEditing.value ? '修改成功' : '添加成功')
}

/* ---- 删除（输入合同名称确认） ---- */
function confirmDelete(item) {
  const input = prompt(`确定要删除合同「${item.name}」吗？请输入该合同名称确认：`)
  if (input === null) return

  if (input.trim() !== item.name) {
    alert('合同名称输入不匹配，取消删除')
    return
  }

  allContracts.value = allContracts.value.filter(c => c.id !== item.id)
  saveContracts(allContracts.value)
  loadContracts()
  alert('删除成功')
}

/* ---- 重置搜索与筛选 ---- */
function resetSearch() {
  searchKeyword.value = ''
  filterSalesperson.value = ''
  sortField.value = ''
  sortOrder.value = 'asc'
}

function closeModal() {
  showModal.value = false
}
</script>

<style src="@/styles/Contracts.css" scoped></style>
