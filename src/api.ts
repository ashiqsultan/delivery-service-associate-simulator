import axios from 'axios';
import { Point } from 'geojson';
import { API_URL } from './constants';

interface AppRes {
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

export const getDeliveryAssociate = async (
  id: string
): Promise<DeliveryAssociateRes> => {
  try {
    const response = await axios.get(`${API_URL}/delivery-associate/${id}`);
    return response.data as DeliveryAssociateRes;
  } catch (error) {
    throw error;
  }
};
