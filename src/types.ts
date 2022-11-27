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
