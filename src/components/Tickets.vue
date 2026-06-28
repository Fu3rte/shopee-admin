<template>
  <div class="tickets-page">
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
        <button class="btn btn-primary" @click="openAddModal">+ 添加售后单</button>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>客户姓名</th>
              <th>客户反馈意见</th>
              <th>状态</th>
              <th>业务员</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTickets.length === 0">
              <td colspan="5" class="empty-row">暂无数据</td>
            </tr>
            <tr v-for="item in filteredTickets" :key="item.id">
              <td>{{ item.customerName }}</td>
              <td>{{ item.feedback }}</td>
              <td><span :class="'status-tag status-' + (item.status || '待处理').toLowerCase()">{{ item.status || '待处理' }}</span></td>
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

    <!-- Modal 弹窗：添加/修改售后单 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEditing ? '修改售后单' : '添加售后单' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form class="modal-body" @submit.prevent="saveTicket">
          <div class="form-row">
            <div class="form-group">
              <label>客户姓名 <span class="required">*</span></label>
              <select v-model="form.customerName" required @change="onCustomerChange">
                <option value="">请选择客户</option>
                <option v-for="c in availableCustomers" :key="c.id" :value="c.name">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <template v-if="isAdmin">
              <div class="form-group">
                <label>分配业务员 <span class="required">*</span></label>
                <select v-model="form.salesperson" required>
                  <option value="">请选择业务员</option>
                  <option v-for="emp in serviceEmployees" :key="emp.id" :value="emp.name">
                    {{ emp.name }}
                  </option>
                </select>
              </div>
            </template>
            <div v-else class="form-group">
              <label>业务员（自动带出）</label>
              <input type="text" :value="form.salesperson" disabled class="auto-field" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>客户反馈意见 <span class="required">*</span></label>
              <textarea v-model="form.feedback" rows="4" placeholder="请输入客户反馈意见" required></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>状态</label>
              <select v-model="form.status">
                <option value="待处理">待处理</option>
                <option value="已处理">已处理</option>
              </select>
            </div>
            <div class="form-group" />
          </div>
          <div class="auto-binding-hint">
            💡 选择客户后，系统将自动查询该客户的跟进业务员并填入上方字段。
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
import { getTickets, saveTickets, getCustomers, getUsers } from '../utils/storage.js'

// 当前用户
const userStr = localStorage.getItem('shopee_current_user')
const currentUser = userStr ? JSON.parse(userStr) : null
const isAdmin = currentUser?.department === '管理部'

/* ===== 数据 ===== */
const tickets = ref([])
const searchKeyword = ref('')
const filterSalesperson = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// 全部客户（下拉框用）
const allCustomers = ref([])

// 可选客户（过滤掉已有售后单的客户）
const availableCustomers = computed(() => {
  const assignedNames = new Set(tickets.value.map(t => t.customerName))
  // 编辑模式下，当前客户仍需可选
  if (isEditing.value && form.value.customerName) {
    assignedNames.delete(form.value.customerName)
  }
  return allCustomers.value.filter(c => !assignedNames.has(c.name))
})

// 所有员工（管理员分配业务员用）
const allEmployees = ref([])
const serviceEmployees = computed(() =>
  allEmployees.value.filter(e => e.department === '售后部')
)

const defaultForm = () => ({
  customerName: '',
  feedback: '',
  salesperson: '',
  status: '待处理'
})

const form = ref(defaultForm())

// 可选的业务员列表（用于筛选下拉）
const salespersonList = computed(() => {
  const names = [...new Set(tickets.value.map(t => t.salesperson).filter(Boolean))]
  return names.sort()
})

const filteredTickets = computed(() => {
  let result = tickets.value

  // 按业务员筛选
  if (filterSalesperson.value) {
    result = result.filter(t => t.salesperson === filterSalesperson.value)
  }

  // 按关键字搜索
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    result = result.filter(t => t.customerName.toLowerCase().includes(keyword))
  }

  return result
})

onMounted(() => {
  loadTickets()
  loadAllCustomers()
  loadEmployees()
})

/* ===== 方法 ===== */
function loadTickets() {
  const all = getTickets()
  if (isAdmin) {
    tickets.value = all
  } else if (currentUser) {
    tickets.value = all.filter(t => t.salesperson === currentUser.name)
  } else {
    tickets.value = []
  }
}

function loadAllCustomers() {
  allCustomers.value = getCustomers()
}

function loadEmployees() {
  allEmployees.value = getUsers()
}

/** 选择客户时自动查找 salesperson 并填入表单 */
function onCustomerChange() {
  const selected = allCustomers.value.find(c => c.name === form.value.customerName)
  form.value.salesperson = selected ? selected.salesperson : ''
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
    feedback: item.feedback,
    salesperson: item.salesperson,
    status: item.status || '待处理'
  }
  showModal.value = true
}

/* ---- 保存 ---- */
function saveTicket() {
  const data = {
    id: isEditing.value ? editingId.value : 'tkt_' + Date.now(),
    customerName: form.value.customerName,
    feedback: form.value.feedback,
    salesperson: form.value.salesperson,
    status: form.value.status || '待处理'
  }

  if (isEditing.value) {
    const index = tickets.value.findIndex(t => t.id === editingId.value)
    if (index !== -1) {
      tickets.value[index] = data
    }
  } else {
    tickets.value.push(data)
  }

  saveTickets(tickets.value)
  showModal.value = false
  alert(isEditing.value ? '修改成功' : '添加成功')
}

/* ---- 删除（输入客户姓名确认） ---- */
function confirmDelete(item) {
  const input = prompt(`确定要删除「${item.customerName}」的售后信息吗？请输入客户姓名以确认删除对应售后信息：`)
  if (input === null) return

  if (input.trim() !== item.customerName) {
    alert('客户姓名输入不匹配，取消删除')
    return
  }

  tickets.value = tickets.value.filter(t => t.id !== item.id)
  saveTickets(tickets.value)
  alert('删除成功')
}

/* ---- 重置搜索与筛选 ---- */
function resetSearch() {
  searchKeyword.value = ''
  filterSalesperson.value = ''
}

function closeModal() {
  showModal.value = false
}
</script>

<style src="@/styles/Tickets.css" scoped></style>
