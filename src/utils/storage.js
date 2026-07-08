const USERS_KEY = 'shopee_users';
const PRODUCTS_KEY = 'shopee_products';
const CUSTOMERS_KEY = 'shopee_customers';
const CONTRACTS_KEY = 'shopee_contracts';
const TICKETS_KEY = 'shopee_tickets';

function loadData(key) {
   try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
   } catch (error) {
      console.error(`读取 ${key} 失败:`, error);
      return [];
   }
}

function saveData(key, data) {
   try {
      localStorage.setItem(key, JSON.stringify(data));
   } catch (error) {
      console.error(`保存 ${key} 失败:`, error);
   }
}

export function initDefaultData() {
   const users = loadData(USERS_KEY);
   if (users.length === 0) {
      const defaultUser = {
         id: '2026',
         username: 'admin',
         password: '123',
         role: 'admin',
         name: '管理员',
         gender: '男',
         age: 30,
         education: '本科',
         department: '管理部',
         hireDate: '2026-06-06',
         position: '经理',
         salary: 20000,
      };
      saveData(USERS_KEY, [defaultUser]);
   }
}

export function getUsers() {
   return loadData(USERS_KEY);
}

export function saveUsers(users) {
   saveData(USERS_KEY, users);
}

export function getProducts() {
   return loadData(PRODUCTS_KEY);
}

export function saveProducts(products) {
   saveData(PRODUCTS_KEY, products);
}

export function getCustomers() {
   return loadData(CUSTOMERS_KEY);
}

export function saveCustomers(customers) {
   saveData(CUSTOMERS_KEY, customers);
}

export function getContracts() {
   return loadData(CONTRACTS_KEY);
}

export function saveContracts(contracts) {
   saveData(CONTRACTS_KEY, contracts);
}

export function getTickets() {
   return loadData(TICKETS_KEY);
}

export function saveTickets(tickets) {
   saveData(TICKETS_KEY, tickets);
}
