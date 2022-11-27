import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShipmentRequest from './ShipmentRequest';
import { IDeliveryAssociate } from './types';
import { socketEvents } from './constants';
import { updateShipmentStatus, updateShipmentDeliveryAssociate } from './api';
import { ShipmentStatus } from './types';

type Props = {
  socket: any;
  deliveryAssociate: IDeliveryAssociate;
};
const Dashboard = (props: Props) => {
  const params = useParams();
  const { deliveryassociateid } = params;
  const [newShipmentRequest, setNewShipmentRequest] = useState({});
  const { name, email, status } = props.deliveryAssociate;

  useEffect(() => {
    props.socket.on(socketEvents.SHIPMENT_CREATED, (data: any) => {
      setNewShipmentRequest(data);
    });
  }, []);

  const onAccept = () => {
    updateShipmentStatus(
      newShipmentRequest?._id,
      ShipmentStatus.deliveryAssociateAssigned
    );
    updateShipmentDeliveryAssociate(
      newShipmentRequest?._id,
      deliveryassociateid || ''
    );
    setNewShipmentRequest({});
  };
  const onReject = () => {
    setNewShipmentRequest({});
  };

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
        <ShipmentRequest onAccept={onAccept} onReject={onReject} />
      ) : null}
    </div>
  );
};
export default Dashboard;
