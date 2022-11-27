import axios from 'axios';
import { API_URL } from './constants';
import { DeliveryAssociateRes, ShipmentRes, ShipmentStatus } from './types';

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

export const updateShipmentStatus = async (
  id: string,
  status: ShipmentStatus
): Promise<ShipmentRes> => {
  const requestBody = { status };
  try {
    const response = await axios.patch(
      `${API_URL}/shipment/${id}/status`,
      requestBody
    );
    return response.data as ShipmentRes;
  } catch (error) {
    throw error;
  }
};

export const updateShipmentDeliveryAssociate = async (
  id: string,
  deliveryAssociateId: string
): Promise<ShipmentRes> => {
  const requestBody = { deliveryAssociateId };
  try {
    const response = await axios.patch(
      `${API_URL}/shipment/${id}/delivery-associate`,
      requestBody
    );
    return response.data as ShipmentRes;
  } catch (error) {
    throw error;
  }
};
