export type CollectType = {
  id: number;
  order_id: number;

  location: {
    latitude: number;
    longitude: number;
  };

  collector?: {
    id: number;
    name: string;
    phone: string;
  } | null;

  customer?: {
    id: number;
    name: string;
    phone: string;
  } | null;

  status: string;

  collected_at?: string | null;

  collection_image?: string | null;

  items?: CollectItemType[];

  created_at?: string;
};
export type CollectItemType = {
  id: number;
  product_id: number;

  product?: {
    name: string;
    volume_liters: number;
  } | null;

  quantity_collected: number;
};
export type DeliveryType = {
  id: number;
  order_id: number;

  location: {
    latitude: number;
    longitude: number;
  };

  delivery_agent?: {
    id: number;
    name: string;
    phone: string;
  } | null;

  status: string;

  assigned_at?: string | null;
  picked_at?: string | null;
  delivered_at?: string | null;

  delivery_proof_type?: string | null;
  delivery_proof_value?: string | null;

  customer?: {
    id: number;
    name: string;
    phone: string;
  } | null;

  delivery_image?: string | null;

  items?: DeliveryItemType[];

  created_at?: string;
};
export type DeliveryItemType = {
  id: number;
  product_id: number;
  product?: {
    name: string;
    volume_liters: number;
  } | null;
  quantity_delivered: number;
};
export interface ProductType {
  id: number;
  name: string;
  is_active: boolean;
  base_price: number;
  volume_liters: number;
  price_km: number;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  is_active: boolean;
}

export interface Order {
  id: number;
  status: 'pending' | 'collector_assigned' | 'processing' | 'delivery_assigned'| 'delivered'| 'cancelled';
  collection_status: 'assigned'|'on_route'|'collected'|'cancelled',
  delivery_status: 'assigned'|'on_route'|'delivered',
  total_amount: number;
  subtotal?: number;
  delivery_fee?: number;
  order_number?: string;
  created_at: string;
  customer:User;
  collector:User;
  delivery_agent:User;
  address:Address;
  items: OrderItem[];
}


export interface Address {
  id: number;
  full_address: string;
  latitude: number;
  longitude: number;
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface TimelineStep {
  step: number;
  label: string;
  completed: boolean;
}

export interface Tracking {
  current_step: number;
  progress_percentage: number;
  status_label: string;
  status_color: string;
  timeline: TimelineStep[];
}

export type OrderDetailType = {
  id: number;
  order_number: string;
  address?: Address | null;
  tracking: Tracking;
  status: OrderStatus;
  collection_status: string;
  delivery_status: string;
  total_amount: number;
  delivery_fee?: number;
  customer?: User | null;
  collect?: CollectType | null;      // 🔹 objet unique
  delivery?: DeliveryType | null;    // 🔹 objet unique
  items?: OrderItem[];
  created_at: string;
};
export type ApiResponse<T> = {
  data: T;
};
export type ResponsePaginate<T> = {
  massage: string
  data: T[]
  meta:{
    current_page:number
    last_page:number
    total:number
  }
}
type OrderStatus =
    | "pending"
    | "collector_assigned"
    | "processing"
    | "delivery_assigned"
    | "delivered"
    | "cancelled";
const statusColor: Record<OrderStatus, string> = {
  pending: "secondary",
  collector_assigned: "info",
  processing: "primary",
  delivery_assigned: "warning",
  delivered: "success",
  cancelled: "danger",
};