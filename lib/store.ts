import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Customer,
  Employee,
  CleaningService,
  CleaningAddon,
  PricingRule,
  NailArtProduct,
  Promo,
  CleaningOrder,
  ProductOrder,
  CartItem,
  Address,
  ProductOrderStatus,
  EmployeeSettlement,
  AuditLog,
  Notification,
  EmployeePaymentProfile,
} from './types';
import {
  seedEmployees,
  seedCleaningServices,
  seedCleaningAddons,
  seedPricingRule,
  seedNailArtProducts,
  seedPromos,
  seedCustomers,
  seedCleaningOrders,
  seedProductOrders,
  seedSettlements,
} from './seed';
import { generateId } from './utils';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (profile: Pick<User, 'name' | 'email' | 'phone'>) => void;

  // Master Data
  employees: Employee[];
  cleaningServices: CleaningService[];
  services: CleaningService[]; // alias for compatibility
  cleaningAddons: CleaningAddon[];
  pricingRule: PricingRule;
  nailArtProducts: NailArtProduct[];
  products: NailArtProduct[]; // alias for compatibility
  promos: Promo[];
  customers: Customer[];
  cleaningOrders: CleaningOrder[];
  productOrders: ProductOrder[];
  settlements: EmployeeSettlement[];
  auditLogs: AuditLog[];
  notifications: Notification[];

  // Cart & Wishlist (Nail Art)
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;

  // Customer Addresses (Max 3)
  updateAddress: (customerId: string, address: Address) => void;
  deleteAddress: (customerId: string, addressId: string) => void;
  getCustomerAddresses: (customerId: string) => Address[];

  // Cleaning Order Lifecycle
  createCleaningOrder: (order: CleaningOrder) => void;
  claimCleaningOrder: (
    orderId: string,
    employeeId: string
  ) => { success: boolean; message: string };
  startOrderTrip: (orderId: string) => void;
  updateEmployeeLocation: (
    orderId: string,
    latitude: number,
    longitude: number,
    etaMinutes: number
  ) => void;
  arriveAtLocation: (orderId: string) => void;
  uploadBeforePhotos: (orderId: string, photos: string[]) => void;
  startService: (orderId: string) => { success: boolean; message?: string };
  toggleChecklist: (orderId: string, checklistId: string) => void;
  uploadAfterPhotos: (orderId: string, photos: string[]) => void;
  completeService: (orderId: string) => { success: boolean; message?: string };
  confirmOrderPayment: (
    orderId: string,
    orderType: 'cleaning' | 'product',
    proofUrl?: string
  ) => void;
  cancelCleaningOrder: (
    orderId: string,
    reason: string,
    cancelledBy: 'customer' | 'admin'
  ) => void;
  rateCleaningOrder: (
    orderId: string,
    rating: number,
    reviewComment?: string
  ) => void;

  // Nail Art Product Orders
  createProductOrder: (order: ProductOrder) => { success: boolean; message?: string };
  updateProductOrderStatus: (
    orderId: string,
    status: ProductOrderStatus,
    courierName?: string,
    trackingNumber?: string
  ) => void;

  // Inventory & Pricing Admin
  updatePricingRule: (updates: Partial<PricingRule>, adminId: string) => void;
  updateProductStock: (
    productId: string,
    variantId: string | undefined,
    deltaQuantity: number
  ) => void;
  saveProduct: (product: NailArtProduct) => void;

  // Employee & Settlement Admin
  saveEmployee: (employee: Employee) => void;
  updateEmployeePaymentProfile: (
    employeeId: string,
    profile: Partial<EmployeePaymentProfile>
  ) => void;
  verifyEmployeePaymentProfile: (employeeId: string, isVerified: boolean) => void;
  updateSettlementRate: (
    employeeId: string | 'all',
    rate: number,
    adminId: string
  ) => void;
  recordSettlementPayment: (
    settlementId: string,
    amount: number,
    method: string,
    proofUrl?: string
  ) => void;
  addSettlementAdjustment: (
    settlementId: string,
    amount: number,
    reason: string,
    adminId: string
  ) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;

  // Cleaning Services & Add-ons Management (Admin)
  addCleaningService: (service: CleaningService) => void;
  updateCleaningService: (id: string, updates: Partial<CleaningService>) => void;
  deleteCleaningService: (id: string) => void;
  addCleaningAddon: (addon: CleaningAddon) => void;
  updateCleaningAddon: (id: string, updates: Partial<CleaningAddon>) => void;
  deleteCleaningAddon: (id: string) => void;

  // Backward compatibility helpers
  orders: any[]; // virtual array computed or returned
  createOrder: (order: any) => void;
  claimOrder: (orderId: string, employeeId: string) => boolean;
  updateOrderStatus: (orderId: string, status: any) => void;
  getOrderById: (orderId: string) => any;
  getCustomerOrders: (customerId: string) => any[];
  getEmployeeOrders: (employeeId: string) => any[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: seedCustomers[0], // Auto-select Clarissa Amanda for instant demo testing
      isAuthenticated: true,

      login: (user: User) => {
        const state = get();
        if (user.role === 'customer') {
          const cust = state.customers.find((c) => c.id === user.id) || user;
          set({ currentUser: cust, isAuthenticated: true });
        } else if (user.role === 'employee') {
          const emp = state.employees.find((e) => e.id === user.id) || user;
          set({ currentUser: emp, isAuthenticated: true });
        } else {
          set({ currentUser: user, isAuthenticated: true });
        }
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, cart: [], wishlist: [] });
      },

      updateProfile: (profile) =>
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...profile } : null,
          customers: state.customers.map((c) =>
            c.id === state.currentUser?.id ? { ...c, ...profile } : c
          ),
          employees: state.employees.map((e) =>
            e.id === state.currentUser?.id ? { ...e, ...profile } : e
          ),
        })),

      // Initial Data
      employees: seedEmployees,
      cleaningServices: seedCleaningServices,
      services: seedCleaningServices,
      cleaningAddons: seedCleaningAddons,
      pricingRule: seedPricingRule,
      nailArtProducts: seedNailArtProducts,
      products: seedNailArtProducts,
      promos: seedPromos,
      customers: seedCustomers,
      cleaningOrders: seedCleaningOrders,
      productOrders: seedProductOrders,
      settlements: seedSettlements,
      auditLogs: [],
      notifications: [],
      cart: [],
      wishlist: [],

      // Virtual property for backward compatibility
      get orders() {
        const state = get();
        return [...(state.cleaningOrders || []), ...(state.productOrders || [])];
      },

      // Cart Actions
      addToCart: (item: CartItem) => {
        const state = get();
        const existing = state.cart.find(
          (ci) => ci.itemId === item.itemId && ci.variantId === item.variantId
        );
        if (existing) {
          set({
            cart: state.cart.map((ci) =>
              ci.itemId === item.itemId && ci.variantId === item.variantId
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
          cart: state.cart.filter((i) => i.id !== itemId && i.itemId !== itemId),
        }));
      },

      updateCartItem: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === itemId || i.itemId === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

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

      // Address Management (Max 3 Addresses)
      updateAddress: (customerId: string, address: Address) => {
        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id !== customerId) return c;
            const existingIdx = c.addresses.findIndex((a) => a.id === address.id);
            let updated = [...c.addresses];

            if (existingIdx >= 0) {
              updated[existingIdx] = address;
            } else {
              if (updated.length >= 3) {
                // Keep max 3 by replacing oldest or last
                updated = [...updated.slice(0, 2), address];
              } else {
                updated.push(address);
              }
            }

            if (address.isDefault) {
              updated = updated.map((a) => ({
                ...a,
                isDefault: a.id === address.id,
              }));
            }

            return { ...c, addresses: updated };
          }),
        }));
      },

      deleteAddress: (customerId: string, addressId: string) => {
        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id !== customerId) return c;
            const remaining = c.addresses.filter((a) => a.id !== addressId);
            if (remaining.length && !remaining.some((a) => a.isDefault)) {
              remaining[0] = { ...remaining[0], isDefault: true };
            }
            return { ...c, addresses: remaining };
          }),
        }));
      },

      getCustomerAddresses: (customerId: string) => {
        const cust = get().customers.find((c) => c.id === customerId);
        return cust?.addresses || [];
      },

      // Cleaning Order Creation
      createCleaningOrder: (order: CleaningOrder) => {
        set((state) => ({
          cleaningOrders: [order, ...state.cleaningOrders],
        }));

        // Broadcast notification to employees
        get().addNotification({
          userId: 'all_employees',
          type: 'order_created',
          title: 'Order Baru Tersedia! 🧹',
          message: `Layanan ${order.serviceName} di ${order.address.detail.substring(0, 30)}... Segera ambil!`,
          orderId: order.id,
        });
      },

      // Atomic Claim Requirement (PRD Section 28 & 29: First Valid Claim Wins)
      claimCleaningOrder: (orderId: string, employeeId: string) => {
        const state = get();
        const order = state.cleaningOrders.find((o) => o.id === orderId);
        const employee = state.employees.find((e) => e.id === employeeId);

        if (!order) {
          return { success: false, message: 'Order tidak ditemukan.' };
        }

        if (!employee) {
          return { success: false, message: 'Employee tidak valid.' };
        }

        // Concurrency check: must be searching_employee
        if (order.status !== 'searching_employee') {
          return {
            success: false,
            message: 'Order telah diambil oleh karyawan lain.',
          };
        }

        // Employee eligibility check: cannot have other active job
        const hasActiveJob = state.cleaningOrders.some(
          (o) =>
            o.employeeId === employeeId &&
            ['assigned', 'on_the_way', 'arrived', 'in_service'].includes(o.status)
        );
        if (hasActiveJob) {
          return {
            success: false,
            message: 'Anda masih memiliki pekerjaan aktif yang belum selesai.',
          };
        }

        // Atomic commit update
        const updatedOrder: CleaningOrder = {
          ...order,
          status: 'assigned',
          employeeId: employee.id,
          employeePaymentSnapshot: employee.paymentProfile,
          updatedAt: new Date().toISOString(),
        };

        set({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId ? updatedOrder : o
          ),
          employees: state.employees.map((e) =>
            e.id === employeeId ? { ...e, currentOrderId: orderId } : e
          ),
        });

        // Notify customer
        get().addNotification({
          userId: order.customerId,
          type: 'employee_found',
          title: 'Karyawan Ditemukan!',
          message: `${employee.name} telah menerima order Anda dan sedang bersiap.`,
          orderId: order.id,
        });

        return { success: true, message: 'Order berhasil diambil!' };
      },

      // Start trip & begin live tracking (PRD Section 32 & 33)
      startOrderTrip: (orderId: string) => {
        const state = get();
        const order = state.cleaningOrders.find((o) => o.id === orderId);
        if (!order) return;

        // Set initial location slightly offset from customer for simulation
        const liveLocation = {
          latitude: order.address.latitude + 0.012,
          longitude: order.address.longitude + 0.015,
          lastUpdated: new Date().toISOString(),
          etaMinutes: 15,
        };

        set({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'on_the_way',
                  liveLocation,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        });

        get().addNotification({
          userId: order.customerId,
          type: 'employee_on_the_way',
          title: 'Karyawan Sedang Menuju Lokasi 🛵',
          message: 'Karyawan mulai melakukan perjalanan ke alamat Anda. Lacak posisi di map.',
          orderId,
        });
      },

      updateEmployeeLocation: (orderId, latitude, longitude, etaMinutes) => {
        set((state) => ({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  liveLocation: {
                    latitude,
                    longitude,
                    lastUpdated: new Date().toISOString(),
                    etaMinutes,
                  },
                }
              : o
          ),
        }));
      },

      // Arrival (PRD Section 36: Live tracking stops)
      arriveAtLocation: (orderId: string) => {
        const state = get();
        const order = state.cleaningOrders.find((o) => o.id === orderId);
        if (!order) return;

        set({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'arrived',
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        });

        get().addNotification({
          userId: order.customerId,
          type: 'employee_arrived',
          title: 'Karyawan Sudah Tiba di Lokasi! 📍',
          message: 'Karyawan telah tiba di alamat Anda dan bersiap memulai pekerjaan.',
          orderId,
        });
      },

      // Upload Before Evidence (PRD Section 37)
      uploadBeforePhotos: (orderId: string, photos: string[]) => {
        set((state) => ({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  beforePhotos: [...o.beforePhotos, ...photos],
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      // Start Service (PRD Section 38: Requires min 1 before photo)
      startService: (orderId: string) => {
        const order = get().cleaningOrders.find((o) => o.id === orderId);
        if (!order) return { success: false, message: 'Order tidak ditemukan' };

        if (!order.beforePhotos || order.beforePhotos.length === 0) {
          return {
            success: false,
            message: 'Wajib upload minimal 1 foto kondisi awal (Before) sebelum memulai.',
          };
        }

        set((state) => ({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'in_service',
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));

        get().addNotification({
          userId: order.customerId,
          type: 'service_started',
          title: 'Pembersihan Dimulai 🧼',
          message: 'Karyawan sedang melakukan pengerjaan cleaning di properti Anda.',
          orderId,
        });

        return { success: true };
      },

      toggleChecklist: (orderId: string, checklistId: string) => {
        set((state) => ({
          cleaningOrders: state.cleaningOrders.map((o) => {
            if (o.id !== orderId) return o;
            return {
              ...o,
              checklist: o.checklist.map((item) =>
                item.id === checklistId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      uploadAfterPhotos: (orderId: string, photos: string[]) => {
        set((state) => ({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  afterPhotos: [...o.afterPhotos, ...photos],
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      // Complete Service (PRD Section 40 & 41: Requires after photo)
      completeService: (orderId: string) => {
        const state = get();
        const order = state.cleaningOrders.find((o) => o.id === orderId);
        if (!order) return { success: false, message: 'Order tidak ditemukan' };

        if (!order.afterPhotos || order.afterPhotos.length === 0) {
          return {
            success: false,
            message: 'Wajib upload minimal 1 foto hasil pekerjaan (After) sebelum menyelesaikan.',
          };
        }

        const completedAt = new Date().toISOString();

        // Update employee stats (100% gross revenue)
        let updatedEmployees = state.employees;
        if (order.employeeId) {
          updatedEmployees = state.employees.map((emp) => {
            if (emp.id !== order.employeeId) return emp;
            const newToday = (emp.grossRevenueToday || 0) + order.priceBreakdown.total;
            const newMonth = (emp.grossRevenueMonth || 0) + order.priceBreakdown.total;
            return {
              ...emp,
              totalJobs: emp.totalJobs + 1,
              grossRevenueToday: newToday,
              grossRevenueMonth: newMonth,
              currentOrderId: undefined,
            };
          });
        }

        set({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'completed',
                  completedAt,
                  updatedAt: completedAt,
                }
              : o
          ),
          employees: updatedEmployees,
        });

        get().addNotification({
          userId: order.customerId,
          type: 'order_completed',
          title: 'Pekerjaan Selesai! 🎉',
          message: 'Pembersihan telah selesai. Silakan cek hasil dan berikan rating.',
          orderId,
        });

        return { success: true };
      },

      // Payment Confirmation (Direct to employee for cleaning, platform for product)
      confirmOrderPayment: (orderId, orderType, proofUrl) => {
        if (orderType === 'cleaning') {
          set((state) => ({
            cleaningOrders: state.cleaningOrders.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    paymentStatus: 'paid',
                    paymentProof: proofUrl || o.paymentProof,
                    updatedAt: new Date().toISOString(),
                  }
                : o
            ),
          }));
        } else {
          set((state) => ({
            productOrders: state.productOrders.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    paymentStatus: 'paid',
                    status: o.status === 'waiting_payment' ? 'paid' : o.status,
                    paymentProof: proofUrl || o.paymentProof,
                    updatedAt: new Date().toISOString(),
                  }
                : o
            ),
          }));
        }
      },

      cancelCleaningOrder: (orderId, reason, cancelledBy) => {
        const state = get();
        const order = state.cleaningOrders.find((o) => o.id === orderId);
        const newStatus =
          cancelledBy === 'customer' ? 'cancelled_customer' : 'cancelled_admin';

        set({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  cancelReason: reason,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
          employees: state.employees.map((e) =>
            e.currentOrderId === orderId ? { ...e, currentOrderId: undefined } : e
          ),
        });

        if (order?.employeeId) {
          get().addNotification({
            userId: order.employeeId,
            type: 'promo',
            title: 'Order Dibatalkan',
            message: `Order ${order.invoiceNumber} dibatalkan oleh ${cancelledBy}: "${reason}".`,
            orderId,
          });
        }
      },

      rateCleaningOrder: (orderId, rating, reviewComment) => {
        const state = get();
        const order = state.cleaningOrders.find((o) => o.id === orderId);
        if (!order || !order.employeeId) return;

        const emp = state.employees.find((e) => e.id === order.employeeId);
        if (emp) {
          const currentTotal = emp.rating * emp.totalJobs;
          const newRating =
            Math.round(((currentTotal + rating) / (emp.totalJobs + 1)) * 10) / 10;
          set({
            employees: state.employees.map((e) =>
              e.id === emp.id ? { ...e, rating: newRating } : e
            ),
          });
        }

        set({
          cleaningOrders: state.cleaningOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  rating,
                  reviewComment,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        });
      },

      // Nail Art Product Checkout & Stock Management (PRD Section 69, 70, 102: Prevent negative stock)
      createProductOrder: (order: ProductOrder) => {
        const state = get();

        // 1. Validate stocks
        for (const item of order.items) {
          const product = state.nailArtProducts.find((p) => p.id === item.productId);
          if (!product) return { success: false, message: `Produk ${item.productName} tidak ditemukan` };

          if (item.variantId) {
            const variant = product.variants.find((v) => v.id === item.variantId);
            if (!variant || variant.stock < item.quantity) {
              return {
                success: false,
                message: `Stok untuk ${item.productName} (${variant?.size || variant?.color || 'varian'}) tidak mencukupi (sisa ${variant?.stock || 0}).`,
              };
            }
          } else {
            if (product.stock < item.quantity) {
              return {
                success: false,
                message: `Stok produk ${product.name} tidak mencukupi (sisa ${product.stock}).`,
              };
            }
          }
        }

        // 2. Decrement stocks safely
        const updatedProducts = state.nailArtProducts.map((p) => {
          const orderItemsForProduct = order.items.filter((i) => i.productId === p.id);
          if (orderItemsForProduct.length === 0) return p;

          let newStock = p.stock;
          let newVariants = [...p.variants];

          for (const item of orderItemsForProduct) {
            newStock = Math.max(0, newStock - item.quantity);
            if (item.variantId) {
              newVariants = newVariants.map((v) =>
                v.id === item.variantId
                  ? { ...v, stock: Math.max(0, v.stock - item.quantity) }
                  : v
              );
            }
          }

          return { ...p, stock: newStock, variants: newVariants };
        });

        set({
          nailArtProducts: updatedProducts,
          products: updatedProducts,
          productOrders: [order, ...state.productOrders],
          cart: [], // Clear cart upon successful order
        });

        get().addNotification({
          userId: order.customerId,
          type: 'order_created',
          title: 'Pesanan Nail Art Diterima! 💅',
          message: `Invoice ${order.invoiceNumber} berhasil dibuat. Kami segera memproses pesanan Anda.`,
          orderId: order.id,
        });

        return { success: true };
      },

      updateProductOrderStatus: (orderId, status, courierName, trackingNumber) => {
        set((state) => ({
          productOrders: state.productOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  courierName: courierName || o.courierName,
                  trackingNumber: trackingNumber || o.trackingNumber,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      // Admin Pricing Rules
      updatePricingRule: (updates, adminId) => {
        const state = get();
        const updated = {
          ...state.pricingRule,
          ...updates,
          version: state.pricingRule.version + 1,
          updatedAt: new Date().toISOString(),
        };

        const auditLog: AuditLog = {
          id: generateId(),
          action: 'UPDATE_PRICING_RULE',
          adminId,
          details: `Diperbarui ke Versi ${updated.version}: Base tiers & fees updated.`,
          timestamp: new Date().toISOString(),
        };

        set({
          pricingRule: updated,
          auditLogs: [auditLog, ...state.auditLogs],
        });
      },

      updateProductStock: (productId, variantId, deltaQuantity) => {
        set((state) => {
          const updated = state.nailArtProducts.map((p) => {
            if (p.id !== productId) return p;
            let newStock = Math.max(0, p.stock + deltaQuantity);
            let newVariants = p.variants;
            if (variantId) {
              newVariants = p.variants.map((v) =>
                v.id === variantId
                  ? { ...v, stock: Math.max(0, v.stock + deltaQuantity) }
                  : v
              );
            }
            return { ...p, stock: newStock, variants: newVariants };
          });
          return { nailArtProducts: updated, products: updated };
        });
      },

      saveProduct: (product) => {
        set((state) => {
          const idx = state.nailArtProducts.findIndex((p) => p.id === product.id);
          const updated = [...state.nailArtProducts];
          if (idx >= 0) {
            updated[idx] = product;
          } else {
            updated.unshift(product);
          }
          return { nailArtProducts: updated, products: updated };
        });
      },

      saveEmployee: (employee) => {
        set((state) => {
          const idx = state.employees.findIndex((e) => e.id === employee.id);
          const updated = [...state.employees];
          if (idx >= 0) {
            updated[idx] = employee;
          } else {
            updated.unshift(employee);
          }
          return { employees: updated };
        });
      },

      updateEmployeePaymentProfile: (employeeId, profile) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === employeeId
              ? {
                  ...e,
                  paymentProfile: {
                    ...e.paymentProfile,
                    ...profile,
                    isVerified: false, // Re-verification required on update
                  },
                }
              : e
          ),
        }));
      },

      verifyEmployeePaymentProfile: (employeeId, isVerified) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === employeeId
              ? {
                  ...e,
                  paymentProfile: { ...e.paymentProfile, isVerified },
                }
              : e
          ),
        }));
      },

      // Settlement Operations (PRD Section 56-62)
      updateSettlementRate: (employeeId, rate, adminId) => {
        const state = get();
        if (employeeId === 'all') {
          set({
            employees: state.employees.map((e) => ({ ...e, settlementRate: rate })),
            settlements: state.settlements.map((s) => ({
              ...s,
              settlementRate: rate,
              settlementDue: Math.round(s.grossRevenue * (rate / 100)),
              remainingAmount: Math.max(
                0,
                Math.round(s.grossRevenue * (rate / 100)) - s.paidAmount
              ),
            })),
            auditLogs: [
              {
                id: generateId(),
                action: 'UPDATE_ALL_SETTLEMENT_RATE',
                adminId,
                details: `Settlement rate global diubah menjadi ${rate}%.`,
                timestamp: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          });
        } else {
          set({
            employees: state.employees.map((e) =>
              e.id === employeeId ? { ...e, settlementRate: rate } : e
            ),
            auditLogs: [
              {
                id: generateId(),
                action: 'UPDATE_EMPLOYEE_SETTLEMENT_RATE',
                adminId,
                details: `Settlement rate untuk employee ${employeeId} diubah ke ${rate}%.`,
                timestamp: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          });
        }
      },

      recordSettlementPayment: (settlementId, amount, method, proofUrl) => {
        set((state) => ({
          settlements: state.settlements.map((s) => {
            if (s.id !== settlementId) return s;
            const newPaid = s.paidAmount + amount;
            const remaining = Math.max(0, s.settlementDue - newPaid);
            const status =
              remaining === 0
                ? 'paid'
                : newPaid > 0
                ? 'partially_paid'
                : s.status;
            return {
              ...s,
              paidAmount: newPaid,
              remainingAmount: remaining,
              status,
              paymentRecords: [
                ...s.paymentRecords,
                {
                  id: generateId(),
                  date: new Date().toISOString().split('T')[0],
                  amount,
                  method,
                  proofUrl,
                },
              ],
            };
          }),
        }));
      },

      addSettlementAdjustment: (settlementId, amount, reason, adminId) => {
        set((state) => ({
          settlements: state.settlements.map((s) => {
            if (s.id !== settlementId) return s;
            const newDue = Math.max(0, s.settlementDue + amount);
            const remaining = Math.max(0, newDue - s.paidAmount);
            return {
              ...s,
              settlementDue: newDue,
              remainingAmount: remaining,
              adjustments: [
                ...s.adjustments,
                {
                  id: generateId(),
                  adminId,
                  amount,
                  reason,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }),
          auditLogs: [
            {
              id: generateId(),
              action: 'SETTLEMENT_ADJUSTMENT',
              adminId,
              details: `Penyesuaian setoran Rp ${amount} pada ${settlementId}: ${reason}`,
              timestamp: new Date().toISOString(),
            },
            ...state.auditLogs,
          ],
        }));
      },

      // Notifications
      markNotificationRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      addNotification: (notification) => {
        const item: Notification = {
          ...notification,
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [item, ...state.notifications],
        }));
      },

      // Cleaning Services & Add-ons Management (Admin)
      addCleaningService: (service: CleaningService) => {
        set((state) => ({
          cleaningServices: [...state.cleaningServices, service],
          services: [...state.cleaningServices, service],
        }));
      },

      updateCleaningService: (id: string, updates: Partial<CleaningService>) => {
        set((state) => {
          const updated = state.cleaningServices.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          );
          return { cleaningServices: updated, services: updated };
        });
      },

      deleteCleaningService: (id: string) => {
        set((state) => {
          const updated = state.cleaningServices.filter((s) => s.id !== id);
          return { cleaningServices: updated, services: updated };
        });
      },

      addCleaningAddon: (addon: CleaningAddon) => {
        set((state) => ({
          cleaningAddons: [...state.cleaningAddons, addon],
        }));
      },

      updateCleaningAddon: (id: string, updates: Partial<CleaningAddon>) => {
        set((state) => ({
          cleaningAddons: state.cleaningAddons.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },

      deleteCleaningAddon: (id: string) => {
        set((state) => ({
          cleaningAddons: state.cleaningAddons.filter((a) => a.id !== id),
        }));
      },

      // Backward compatibility implementations
      createOrder: (order: any) => {
        if (order.orderType === 'product') {
          get().createProductOrder(order);
        } else {
          get().createCleaningOrder(order);
        }
      },

      claimOrder: (orderId: string, employeeId: string) => {
        const res = get().claimCleaningOrder(orderId, employeeId);
        return res.success;
      },

      updateOrderStatus: (orderId: string, status: any) => {
        const state = get();
        if (state.cleaningOrders.some((o) => o.id === orderId)) {
          set({
            cleaningOrders: state.cleaningOrders.map((o) =>
              o.id === orderId ? { ...o, status } : o
            ),
          });
        } else {
          get().updateProductOrderStatus(orderId, status);
        }
      },

      getOrderById: (orderId: string) => {
        const state = get();
        return (
          state.cleaningOrders.find((o) => o.id === orderId) ||
          state.productOrders.find((o) => o.id === orderId)
        );
      },

      getCustomerOrders: (customerId: string) => {
        const state = get();
        return [
          ...state.cleaningOrders.filter((o) => o.customerId === customerId),
          ...state.productOrders.filter((o) => o.customerId === customerId),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getEmployeeOrders: (employeeId: string) => {
        const state = get();
        return state.cleaningOrders
          .filter((o) => o.employeeId === employeeId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },
    }),
    {
      name: 'home-cleaning-nail-commerce-v2',
      onRehydrateStorage: () => (state) => {
        if (state && !state.currentUser) {
          state.currentUser = seedCustomers[0];
          state.isAuthenticated = true;
        }
      },
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        customers: state.customers,
        employees: state.employees,
        cleaningOrders: state.cleaningOrders,
        productOrders: state.productOrders,
        settlements: state.settlements,
        pricingRule: state.pricingRule,
        nailArtProducts: state.nailArtProducts,
        cart: state.cart,
        wishlist: state.wishlist,
        notifications: state.notifications,
        auditLogs: state.auditLogs,
      }),
    }
  )
);

export default useAppStore;
