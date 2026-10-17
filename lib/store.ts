import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Customer,
  Employee,
  Service,
  Product,
  Bundle,
  Promo,
  Order,
  CartItem,
  Address,
  OrderStatus,
} from './types';
import {
  seedEmployees,
  seedServices,
  seedProducts,
  seedBundles,
  seedPromos,
  seedCustomers,
} from './seed';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Data
  employees: Employee[];
  services: Service[];
  products: Product[];
  bundles: Bundle[];
  promos: Promo[];
  customers: Customer[];
  orders: Order[];
  notifications: any[];

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getCustomerOrders: (customerId: string) => Order[];
  getEmployeeOrders: (employeeId: string) => Order[];
  claimOrder: (orderId: string, employeeId: string) => boolean;

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;

  // Address
  updateAddress: (customerId: string, address: Address) => void;
  getCustomerAddresses: (customerId: string) => Address[];
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,

      login: (user: User) => {
        set({ currentUser: user, isAuthenticated: true });
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, cart: [], wishlist: [] });
      },

      // Data initialization
      employees: seedEmployees,
      services: seedServices,
      products: seedProducts,
      bundles: seedBundles,
      promos: seedPromos,
      customers: seedCustomers,
      orders: [],
      notifications: [],

      // Cart
      cart: [],
      wishlist: [],

      addToCart: (item: CartItem) => {
        const state = get();
        const existingItem = state.cart.find(
          (ci) =>
            ci.itemId === item.itemId &&
            ci.type === item.type &&
            ci.variationId === item.variationId
        );

        if (existingItem) {
          set({
            cart: state.cart.map((ci) =>
              ci.id === existingItem.id
                ? { ...ci, quantity: ci.quantity + item.quantity }
                : ci
            ),
          });
        } else {
          set({ cart: [...state.cart, item] });
        }
      },

      removeFromCart: (itemId: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        }));
      },

      updateCartItem: (itemId: string, quantity: number) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Orders
      createOrder: (order: Order) => {
        set((state) => ({
          orders: [...state.orders, order],
        }));
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
          ),
        }));
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getCustomerOrders: (customerId: string) => {
        return get().orders.filter((order) => order.customerId === customerId);
      },

      getEmployeeOrders: (employeeId: string) => {
        return get().orders.filter((order) => order.employeeId === employeeId);
      },

      claimOrder: (orderId: string, employeeId: string) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);

        if (!order || order.status !== 'waiting_employee') {
          return false;
        }

        // Atomic claim: check if order is still available
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId && o.status === 'waiting_employee'
              ? { ...o, employeeId, status: 'accepted' as OrderStatus }
              : o
          ),
          employees: state.employees.map((emp) =>
            emp.id === employeeId
              ? {
                  ...emp,
                  currentOrderId: orderId,
                  commission: emp.commission + (order.totalPrice * 0.2),
                }
              : emp
          ),
        }));

        // Verify the claim was successful
        const updatedOrder = get().orders.find((o) => o.id === orderId);
        return updatedOrder?.employeeId === employeeId && updatedOrder?.status === 'accepted';
      },

      // Wishlist
      addToWishlist: (productId: string) => {
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist
            : [...state.wishlist, productId],
        }));
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }));
      },

      // Address
      updateAddress: (customerId: string, address: Address) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  addresses: customer.addresses.some((a) => a.id === address.id)
                    ? customer.addresses.map((a) => (a.id === address.id ? address : a))
                    : [...customer.addresses, address],
                }
              : customer
          ),
        }));
      },

      getCustomerAddresses: (customerId: string) => {
        const customer = get().customers.find((c) => c.id === customerId);
        return customer?.addresses || [];
      },
    }),
    {
      name: 'salon-app-storage',
      version: 2,
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        orders: state.orders,
        employees: state.employees,
        cart: state.cart,
        wishlist: state.wishlist,
        customers: state.customers,
      }),
    }
  )
);

export default useAppStore;
