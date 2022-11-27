import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import ShipmentRequest from './ShipmentRequest';
import { IDeliveryAssociate } from './types';
import { socketEvents } from './constants';

type Props = {
  socket: any;
  deliveryAssociate: IDeliveryAssociate;
};
const Dashboard = (props: Props) => {
  const [newShipmentRequest, setNewShipmentRequest] = useState({});
  const { name, email, status } = props.deliveryAssociate;

  useEffect(() => {
    props.socket.on(socketEvents.SHIPMENT_CREATED, (data: any) => {
      setNewShipmentRequest(data);
    });
  }, []);

  return (
    <div>
      <Typography gutterBottom variant='h6'>
        Name: {name}
      </Typography>
      <Typography gutterBottom variant='h6'>
        Status: {status}
      </Typography>
      {/* New Shipment Notification */}
      {newShipmentRequest._id ? (
        <ShipmentRequest
          shipmentData={newShipmentRequest}
          setNewShipmentRequest={setNewShipmentRequest}
        />
      ) : null}
    </div>
  );
};
export default Dashboard;
