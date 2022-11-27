import { Point } from 'geojson';

export interface AppRes {
  data: any;
  isError: boolean;
  errMsg?: string;
}

export enum DeliveryAssociateStatus {
  available = 'available',
  delivering = 'delivering',
  off = 'off',
}

export interface IDeliveryAssociate {
  email: string;
  name: string;
  status: DeliveryAssociateStatus;
  currentLocation: Point;
}

export interface DeliveryAssociateRes extends AppRes {
  data: IDeliveryAssociate;
}

export enum ShipmentStatus {
  requested = 'requested',
  deliveryAssociateAssigned = 'deliveryAssociateAssigned',
  pickupLocationReached = 'pickupLocationReached',
  transporting = 'transporting',
  dropLocationReached = 'dropLocationReached',
  delivered = 'delivered',
  cancelled = 'cancelled',
}
export interface IShipment {
  pickupLocation: Point;
  dropLocation: Point;
  userId: string;
  status: ShipmentStatus;
  deliveryAssociateId?: string;
}
export interface ShipmentRes extends AppRes {
  data: IShipment;
}