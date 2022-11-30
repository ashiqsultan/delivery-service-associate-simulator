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
  setShipmentData: any;
};
const Dashboard = (props: Props) => {
  const params = useParams();
  const { deliveryassociateid } = params;
  const [newShipmentRequest, setNewShipmentRequest] = useState({});
  const { _id, name, email, status } = props.deliveryAssociate;

  useEffect(() => {
    props.socket.on(socketEvents.SHIPMENT_CREATED, (data: any) => {
      setNewShipmentRequest(data);
    });
  }, []);

  const onAccept = async () => {
    await updateShipmentStatus(
      newShipmentRequest?._id,
      ShipmentStatus.deliveryAssociateAssigned
    );
    const shipmentData = await updateShipmentDeliveryAssociate(
      newShipmentRequest?._id,
      deliveryassociateid || ''
    );
    props.setShipmentData(shipmentData.data);
    setNewShipmentRequest({});
  };
  const onReject = () => {
    setNewShipmentRequest({});
  };

  return (
    <div>
      <Typography gutterBottom variant='h6'>
        Id: {_id}
      </Typography>
      <Typography gutterBottom variant='h6'>
        Email: {email}
      </Typography>
      <Typography gutterBottom variant='h6'>
        Name: {name}
      </Typography>
      {/* New Shipment Notification */}
      {newShipmentRequest._id ? (
        <ShipmentRequest onAccept={onAccept} onReject={onReject} />
      ) : null}
    </div>
  );
};
export default Dashboard;
