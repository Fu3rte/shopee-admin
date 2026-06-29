// localStorage 存储工具（Keys, 初始化, 读写方法）

/* ===== Keys ===== */

const USERS_KEY = 'shopee_users'
const PRODUCTS_KEY = 'shopee_products'
const CUSTOMERS_KEY = 'shopee_customers'
const CONTRACTS_KEY = 'shopee_contracts'
const TICKETS_KEY = 'shopee_tickets'

/* ===== 通用读写 ===== */

function loadData(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.error(`读取 ${key} 失败:`, error)
    return []
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`保存 ${key} 失败:`, error)
  }
}

/* ===== 用户 ===== */

export function getUsers() {
  return loadData(USERS_KEY)
}

export function saveUsers(users) {
  saveData(USERS_KEY, users)
}

/* ===== 商品 ===== */

export function getProducts() {
  return loadData(PRODUCTS_KEY)
}

export function saveProducts(products) {
  saveData(PRODUCTS_KEY, products)
}

/* ===== 客户 ===== */

export function getCustomers() {
  return loadData(CUSTOMERS_KEY)
}

export function saveCustomers(customers) {
  saveData(CUSTOMERS_KEY, customers)
}

/* ===== 合同 ===== */

export function getContracts() {
  return loadData(CONTRACTS_KEY)
}

export function saveContracts(contracts) {
  saveData(CONTRACTS_KEY, contracts)
}

/* ===== 工单 ===== */

export function getTickets() {
  return loadData(TICKETS_KEY)
}

export function saveTickets(tickets) {
  saveData(TICKETS_KEY, tickets)
}
