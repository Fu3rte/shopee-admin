<template>
  <div class="products-page">
    <div class="card">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="search-area">
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="输入产品名称查询"
          />
          <button class="btn btn-default" @click="resetSearch">重置</button>
          <select v-model="filterType" class="filter-select">
            <option value="">全部类型</option>
            <option v-for="t in typeList" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="openAddModal">+ 添加产品</button>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>产品名称</th>
              <th>产品类型</th>
              <th class="sortable" @click="sortBy('quantity')">
                产品数量
                <span v-if="sortField === 'quantity'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="sortable" @click="sortBy('price')">
                产品价格
                <span v-if="sortField === 'price'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="5" class="empty-row">暂无数据</td>
            </tr>
            <tr v-for="item in pagedProducts" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price }}</td>
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

    <!-- Modal 弹窗：添加/修改产品 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEditing ? '修改产品' : '添加产品' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form class="modal-body" @submit.prevent="saveProduct">
          <div class="form-row">
            <div class="form-group">
              <label>产品名称 <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="请输入产品名称" required />
            </div>
            <div class="form-group">
              <label>产品类型 <span class="required">*</span></label>
              <input v-model="form.type" type="text" placeholder="请输入产品类型" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>产品数量 <span class="required">*</span></label>
              <input v-model.number="form.quantity" type="number" min="1" placeholder="请输入产品数量" required />
            </div>
            <div class="form-group">
              <label>产品价格 <span class="required">*</span></label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="请输入产品价格" required />
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
import { ref, computed, onMounted, watch } from 'vue'
import { getProducts, saveProducts } from '../utils/storage.js'

const products = ref([])
const searchKeyword = ref('')
const filterType = ref('')
const sortField = ref('')
const sortOrder = ref('asc')

/* ===== 分页 ===== */
const pageSize = 10
const currentPage = ref(1)

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize) || 1)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const defaultForm = () => ({
  name: '',
  type: '',
  quantity: '',
  price: ''
})

const form = ref(defaultForm())

// 可选的类型列表（用于筛选下拉）
const typeList = computed(() => {
  return [...new Set(products.value.map(p => p.type).filter(Boolean))].sort()
})

const filteredProducts = computed(() => {
  let result = products.value

  // 按类型筛选
  if (filterType.value) {
    result = result.filter(p => p.type === filterType.value)
  }

  // 按关键字搜索
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    result = result.filter(p => p.name.toLowerCase().includes(keyword))
  }

  // 排序
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      const va = Number(a[sortField.value]) || 0
      const vb = Number(b[sortField.value]) || 0
      return sortOrder.value === 'asc' ? va - vb : vb - va
    })
  }

  return result
})

// 排序切换
function sortBy(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

onMounted(() => {
  loadProducts()
})

/* ===== 方法 ===== */
function loadProducts() {
  products.value = getProducts()
}

// 筛选条件变化时回到第一页
watch([searchKeyword, filterType, sortField], () => {
  currentPage.value = 1
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

/* ---- 添加 ---- */
function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  showModal.value = true
}

/* ---- 修改 ---- */
function openEditModal(item) {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    name: item.name,
    type: item.type,
    quantity: item.quantity,
    price: item.price
  }
  showModal.value = true
}

/* ---- 保存 ---- */
function saveProduct() {
  const data = {
    id: isEditing.value ? editingId.value : 'prod_' + Date.now(),
    name: form.value.name,
    type: form.value.type,
    quantity: Number(form.value.quantity),
    price: Number(form.value.price)
  }

  if (isEditing.value) {
    const index = products.value.findIndex(p => p.id === editingId.value)
    if (index !== -1) {
      products.value[index] = data
    }
  } else {
    products.value.push(data)
  }

  saveProducts(products.value)
  showModal.value = false
  alert(isEditing.value ? '修改成功' : '添加成功')
}

/* ---- 删除（输入产品名称确认） ---- */
function confirmDelete(item) {
  const input = prompt(`确定要删除产品「${item.name}」吗？请输入该产品名称确认：`)
  if (input === null) return

  if (input.trim() !== item.name) {
    alert('产品名称输入不匹配，取消删除')
    return
  }

  products.value = products.value.filter(p => p.id !== item.id)
  saveProducts(products.value)
  alert('删除成功')
}

/* ---- 重置搜索 ---- */
function resetSearch() {
  searchKeyword.value = ''
  filterType.value = ''
  sortField.value = ''
  sortOrder.value = 'asc'
}

function closeModal() {
  showModal.value = false
}
</script>

<style src="@/styles/Products.css" scoped></style>
