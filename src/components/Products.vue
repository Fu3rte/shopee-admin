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
              <th>产品数量</th>
              <th>产品价格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="5" class="empty-row">暂无数据</td>
            </tr>
            <tr v-for="item in filteredProducts" :key="item.id">
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
import { ref, computed, onMounted } from 'vue'
import { getProducts, saveProducts } from '../utils/storage.js'

const products = ref([])
const searchKeyword = ref('')
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

const filteredProducts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return products.value
  return products.value.filter(p => p.name.toLowerCase().includes(keyword))
})

onMounted(() => {
  loadProducts()
})

/* ===== 方法 ===== */
function loadProducts() {
  products.value = getProducts()
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
}

function closeModal() {
  showModal.value = false
}
</script>

<style src="@/styles/Products.css" scoped></style>
