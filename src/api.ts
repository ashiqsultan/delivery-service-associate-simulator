import axios from 'axios';
import { API_URL } from './constants';
import { DeliveryAssociateRes } from './types';

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
