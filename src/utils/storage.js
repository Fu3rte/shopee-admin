// localStorage 存储工具（Keys, 初始化, 读写方法）

/* ===== Keys ===== */

const USERS_KEY = 'shopee_users'
const PRODUCTS_KEY = 'shopee_products'
const CUSTOMERS_KEY = 'shopee_customers'
const CONTRACTS_KEY = 'shopee_contracts'
const TICKETS_KEY = 'shopee_tickets'

/* ===== 默认管理员 ===== */

/** 默认管理员账号 */
const DEFAULT_ADMIN = [
  {
    id: 'admin_001',
    username: 'admin',
    password: '123456',
    role: 'admin',
    name: '陈祺宏',
    gender: '男',
    age: 28,
    education: '本科',
    department: '管理部',
    hireDate: '2026-01-01',
    position: '系统管理员',
    salary: 15000
  }
]

/* ===== Mock 数据 ===== */

const MOCK_EMPLOYEES = [
  { id: 'emp_001', username: 'zhangsan', password: '123456', role: 'sales', name: '张三', gender: '男', age: 30, education: '本科', department: '业务部', hireDate: '2026-03-01', position: '跨境业务员', salary: 12000 },
  { id: 'emp_002', username: 'lisi', password: '123456', role: 'sales', name: '李四', gender: '女', age: 27, education: '本科', department: '业务部', hireDate: '2026-03-15', position: '跨境业务员', salary: 12000 },
  { id: 'emp_003', username: 'wangwu', password: '123456', role: 'product', name: '王五', gender: '男', age: 29, education: '本科', department: '产品部', hireDate: '2026-02-01', position: '产品专员', salary: 13000 },
  { id: 'emp_004', username: 'zhaoliu', password: '123456', role: 'customer_service', name: '赵六', gender: '女', age: 26, education: '大专', department: '售后部', hireDate: '2026-04-01', position: '售后客服', salary: 10000 }
]

const MOCK_PRODUCTS = [
  { id: 'prod_001', name: 'Shopee手机壳', type: '手机配件', quantity: 5000, price: 15.90 },
  { id: 'prod_002', name: '跨境蓝牙耳机', type: '数码配件', quantity: 2000, price: 89.90 }
]

const MOCK_CUSTOMERS = [
  { id: 'cust_001', name: '泰国大客商', phone: '+66-12345678', address: '泰国曼谷素坤逸路 101 号', email: 'thaibuyer@example.com', salesperson: '张三' }
]

const MOCK_CONTRACTS = [
  { id: 'ctr_001', customerName: '泰国大客商', name: '泰国50k采购合同', content: '50,000 件手机配件年度采购协议，分期交付', startDate: '2026-06-01', expiryDate: '2027-05-31', salesperson: '张三' }
]

const MOCK_TICKETS = [
  { id: 'tkt_001', customerName: '泰国大客商', feedback: '收到的手机壳出现色差，要求退换货处理', salesperson: '张三', status: '待处理' }
]

/* ===== 初始化 ===== */

function initStorage() {
  try {
    // 冷启动：写入默认管理员 + mock 数据
    const users = localStorage.getItem(USERS_KEY)
    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify([...DEFAULT_ADMIN, ...MOCK_EMPLOYEES]))
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS))
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(MOCK_CUSTOMERS))
      localStorage.setItem(CONTRACTS_KEY, JSON.stringify(MOCK_CONTRACTS))
      localStorage.setItem(TICKETS_KEY, JSON.stringify(MOCK_TICKETS))
    }
  } catch (error) {
    console.error('initStorage 初始化存储失败:', error)
  }
}

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

// 自动执行初始化
initStorage()
