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
    position: '经理',
    salary: 15000
  }
]

/* ===== Mock 数据 ===== */

const MOCK_EMPLOYEES = [
  { id: 'emp_001', username: 'zhangsan', password: '123456', role: 'sales', name: '张三', gender: '男', age: 30, education: '本科', department: '业务部', hireDate: '2026-03-01', position: '跨境业务员', salary: 12000 },
  { id: 'emp_002', username: 'lisi', password: '123456', role: 'sales', name: '李四', gender: '女', age: 27, education: '本科', department: '业务部', hireDate: '2026-03-15', position: '跨境业务员', salary: 12000 },
  { id: 'emp_003', username: 'wangwu', password: '123456', role: 'product', name: '王五', gender: '男', age: 29, education: '本科', department: '产品部', hireDate: '2026-02-01', position: '产品专员', salary: 13000 },
  { id: 'emp_004', username: 'zhaoliu', password: '123456', role: 'customer_service', name: '赵六', gender: '女', age: 26, education: '大专', department: '售后部', hireDate: '2026-04-01', position: '售后客服', salary: 10000 },
  { id: 'emp_005', username: 'sunqi', password: '123456', role: 'sales', name: '孙七', gender: '男', age: 32, education: '本科', department: '业务部', hireDate: '2026-03-20', position: '跨境业务员', salary: 12500 },
  { id: 'emp_006', username: 'zhouba', password: '123456', role: 'product', name: '周八', gender: '女', age: 25, education: '硕士', department: '产品部', hireDate: '2026-04-10', position: '产品专员', salary: 14000 },
  { id: 'emp_007', username: 'wujiu', password: '123456', role: 'customer_service', name: '吴九', gender: '女', age: 24, education: '大专', department: '售后部', hireDate: '2026-05-01', position: '售后客服', salary: 9500 },
  { id: 'emp_008', username: 'zhengshi', password: '123456', role: 'sales', name: '郑十', gender: '男', age: 35, education: '高中', department: '业务部', hireDate: '2026-01-15', position: '跨境业务员', salary: 11000 },
  { id: 'emp_009', username: 'chenliang', password: '123456', role: 'product', name: '陈亮', gender: '男', age: 31, education: '本科', department: '产品部', hireDate: '2026-02-20', position: '产品经理', salary: 16000 },
  { id: 'emp_010', username: 'huangli', password: '123456', role: 'customer_service', name: '黄丽', gender: '女', age: 23, education: '本科', department: '售后部', hireDate: '2026-06-01', position: '售后客服', salary: 9800 },
  { id: 'emp_011', username: 'linjie', password: '123456', role: 'sales', name: '林杰', gender: '男', age: 29, education: '本科', department: '业务部', hireDate: '2026-04-05', position: '跨境业务主管', salary: 15000 },
  { id: 'emp_012', username: 'hewei', password: '123456', role: 'product', name: '何薇', gender: '女', age: 28, education: '硕士', department: '产品部', hireDate: '2026-05-10', position: '产品专员', salary: 13500 },
  { id: 'emp_013', username: 'yangfan', password: '123456', role: 'customer_service', name: '杨帆', gender: '男', age: 26, education: '大专', department: '售后部', hireDate: '2026-06-10', position: '售后客服', salary: 9200 },
  { id: 'emp_014', username: 'liuyun', password: '123456', role: 'sales', name: '刘云', gender: '女', age: 33, education: '高中', department: '业务部', hireDate: '2025-11-01', position: '跨境业务员', salary: 10500 },
  { id: 'emp_015', username: 'xuming', password: '123456', role: 'admin', name: '徐明', gender: '男', age: 40, education: '本科', department: '管理部', hireDate: '2025-06-01', position: '人事主管', salary: 18000 },
  { id: 'emp_016', username: 'caixue', password: '123456', role: 'admin', name: '蔡雪', gender: '女', age: 32, education: '本科', department: '管理部', hireDate: '2025-09-01', position: '财务专员', salary: 16000 }
]

const MOCK_PRODUCTS = [
  { id: 'prod_001', name: 'Shopee手机壳', type: '手机配件', quantity: 5000, price: 15.90 },
  { id: 'prod_002', name: '跨境蓝牙耳机', type: '数码配件', quantity: 2000, price: 89.90 },
  { id: 'prod_003', name: 'Type-C数据线', type: '数码配件', quantity: 8000, price: 12.50 },
  { id: 'prod_004', name: '手机钢化膜', type: '手机配件', quantity: 10000, price: 8.90 },
  { id: 'prod_005', name: '便携充电宝', type: '数码配件', quantity: 1500, price: 69.00 },
  { id: 'prod_006', name: '自拍杆三脚架', type: '摄影配件', quantity: 3000, price: 25.00 },
  { id: 'prod_007', name: '运动蓝牙手环', type: '可穿戴', quantity: 1200, price: 129.00 },
  { id: 'prod_008', name: '车载手机支架', type: '车载配件', quantity: 4500, price: 19.90 },
  { id: 'prod_009', name: '无线充电板', type: '数码配件', quantity: 2200, price: 45.00 },
  { id: 'prod_010', name: '卡通手机挂绳', type: '手机配件', quantity: 6000, price: 5.50 },
  { id: 'prod_011', name: '迷你蓝牙音箱', type: '数码配件', quantity: 980, price: 79.00 },
  { id: 'prod_012', name: '智能体脂秤', type: '可穿戴', quantity: 760, price: 99.00 }
]

const MOCK_CUSTOMERS = [
  { id: 'cust_001', name: '泰国大客商', phone: '+66-12345678', address: '泰国曼谷素坤逸路 101 号', email: 'thaibuyer@example.com', salesperson: '张三' },
  { id: 'cust_002', name: '新加坡电商', phone: '+65-98765432', address: '新加坡乌节路 88 号', email: 'sgbuyer@example.com', salesperson: '张三' },
  { id: 'cust_003', name: '马来西亚批发商', phone: '+60-12345678', address: '吉隆坡武吉免登路 25 号', email: 'mybuyer@example.com', salesperson: '李四' },
  { id: 'cust_004', name: '印尼贸易公司', phone: '+62-812345678', address: '雅加达市中心商业街 12 号', email: 'idbuyer@example.com', salesperson: '李四' },
  { id: 'cust_005', name: '越南零售商', phone: '+84-901234567', address: '胡志明市第一郡 66 号', email: 'vnbuyer@example.com', salesperson: '孙七' },
  { id: 'cust_006', name: '菲律宾采购商', phone: '+63-912345678', address: '马尼拉金融区 7 号', email: 'phbuyer@example.com', salesperson: '孙七' },
  { id: 'cust_007', name: '台湾贸易商', phone: '+886-912345678', address: '台北市信义区 200 号', email: 'twbuyer@example.com', salesperson: '刘云' },
  { id: 'cust_008', name: '韩国美妆经销商', phone: '+82-1098765432', address: '首尔江南区 55 号', email: 'krbuyer@example.com', salesperson: '郑十' },
  { id: 'cust_009', name: '日本电商平台', phone: '+81-8012345678', address: '东京涩谷区 3 丁目 15 号', email: 'jpbuyer@example.com', salesperson: '林杰' },
  { id: 'cust_010', name: '缅甸进出口公司', phone: '+95-925001234', address: '仰光班杜拉路 88 号', email: 'mmbuyer@example.com', salesperson: '张三' },
  { id: 'cust_011', name: '柬埔寨批发商', phone: '+855-12345678', address: '金边俄罗斯大道 66 号', email: 'khbuyer@example.com', salesperson: '李四' },
  { id: 'cust_012', name: '印度电商卖家', phone: '+91-9876543210', address: '孟买商业中心 101 号', email: 'inbuyer@example.com', salesperson: '刘云' },
  { id: 'cust_013', name: '澳大利亚客户', phone: '+61-412345678', address: '悉尼乔治大街 200 号', email: 'aubuyer@example.com', salesperson: '林杰' }
]

const MOCK_CONTRACTS = [
  { id: 'ctr_001', customerName: '泰国大客商', name: '泰国50k采购合同', content: '50,000 件手机配件年度采购协议，分期交付', startDate: '2026-06-01', expiryDate: '2027-05-31', salesperson: '张三' },
  { id: 'ctr_002', customerName: '新加坡电商', name: '新加坡Q3数码配件合同', content: '3,000 件蓝牙耳机 + 5,000 条数据线', startDate: '2026-07-01', expiryDate: '2026-12-31', salesperson: '张三' },
  { id: 'ctr_003', customerName: '马来西亚批发商', name: '马来西亚手机配件合同', content: '10,000 件手机壳 + 8,000 张钢化膜', startDate: '2026-05-01', expiryDate: '2026-10-31', salesperson: '李四' },
  { id: 'ctr_004', customerName: '印尼贸易公司', name: '印尼首批供货合同', content: '2,000 件充电宝 + 1,000 个蓝牙音箱', startDate: '2026-08-01', expiryDate: '2027-02-28', salesperson: '李四' },
  { id: 'ctr_005', customerName: '越南零售商', name: '越南手机配件试单合同', content: '1,500 件手机壳 + 500 个车载支架', startDate: '2026-06-15', expiryDate: '2026-09-15', salesperson: '孙七' },
  { id: 'ctr_006', customerName: '菲律宾采购商', name: '菲律宾Q4采购合同', content: '5,000 件数据线 + 3,000 个充电器', startDate: '2026-10-01', expiryDate: '2027-03-31', salesperson: '孙七' },
  { id: 'ctr_007', customerName: '台湾贸易商', name: '台湾电子配件年度合同', content: '20,000 件各类手机配件，按月交付', startDate: '2026-04-01', expiryDate: '2027-03-31', salesperson: '刘云' },
  { id: 'ctr_008', customerName: '韩国美妆经销商', name: '韩国美妆工具采购合同', content: '10,000 套美妆工具套装，含物流', startDate: '2026-09-01', expiryDate: '2027-01-31', salesperson: '郑十' },
  { id: 'ctr_009', customerName: '日本电商平台', name: '日本高端配件代理合同', content: '首批 1,000 件高端蓝牙耳机 + 500 个智能手环', startDate: '2026-11-01', expiryDate: '2027-10-31', salesperson: '林杰' },
  { id: 'ctr_010', customerName: '缅甸进出口公司', name: '缅甸首批供货合同', content: '3,000 件手机壳 + 2,000 条数据线', startDate: '2026-07-15', expiryDate: '2027-01-15', salesperson: '张三' },
  { id: 'ctr_011', customerName: '印度电商卖家', name: '印度市场试水合同', content: '5,000 件自拍杆 + 2,000 个充电宝', startDate: '2026-12-01', expiryDate: '2027-05-31', salesperson: '刘云' },
  { id: 'ctr_012', customerName: '澳大利亚客户', name: '澳洲长期供应合同', content: '数码配件年度供应，预估总额 50 万澳元', startDate: '2026-08-01', expiryDate: '2027-07-31', salesperson: '林杰' }
]

const MOCK_TICKETS = [
  { id: 'tkt_001', customerName: '泰国大客商', feedback: '收到的手机壳出现色差，要求退换货处理', salesperson: '张三', status: '待处理' },
  { id: 'tkt_002', customerName: '新加坡电商', feedback: '蓝牙耳机左耳无声，要求换货', salesperson: '张三', status: '已处理' },
  { id: 'tkt_003', customerName: '马来西亚批发商', feedback: '钢化膜尺寸不匹配，要求退货', salesperson: '李四', status: '待处理' },
  { id: 'tkt_004', customerName: '印尼贸易公司', feedback: '充电宝容量与描述不符，投诉', salesperson: '李四', status: '待处理' },
  { id: 'tkt_005', customerName: '越南零售商', feedback: '部分手机壳有划痕，要求赔偿', salesperson: '孙七', status: '已处理' },
  { id: 'tkt_006', customerName: '菲律宾采购商', feedback: '数据线接头松动，批次质量问题', salesperson: '孙七', status: '待处理' },
  { id: 'tkt_007', customerName: '台湾贸易商', feedback: '订单数量少了200件，要求补发', salesperson: '刘云', status: '待处理' },
  { id: 'tkt_008', customerName: '韩国美妆经销商', feedback: '美妆工具包装破损，要求换包装', salesperson: '郑十', status: '已处理' },
  { id: 'tkt_009', customerName: '日本电商平台', feedback: '智能手环无法连接APP，技术问题', salesperson: '林杰', status: '待处理' },
  { id: 'tkt_010', customerName: '缅甸进出口公司', feedback: '物流延误超过15天，要求减免运费', salesperson: '张三', status: '待处理' },
  { id: 'tkt_011', customerName: '印度电商卖家', feedback: '自拍杆蓝牙遥控失灵，要求维修', salesperson: '刘云', status: '待处理' },
  { id: 'tkt_012', customerName: '澳大利亚客户', feedback: '充电板不兼容澳标插头，要求适配器', salesperson: '林杰', status: '已处理' }
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
