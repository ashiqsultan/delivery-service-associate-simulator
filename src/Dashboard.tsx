import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShipmentRequest from './ShipmentRequest';
import { IDeliveryAssociate, IShipment } from './types';
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
  // @ts-ignore
  const [newShipmentRequest, setNewShipmentRequest] = useState<IShipment>({});
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
    // @ts-ignore
    setNewShipmentRequest({});
  };
  const onReject = () => {
    // @ts-ignore
    setNewShipmentRequest({});
  };

  return (
    <div
      style={{
        padding: '25px 40px',
      }}
    >
      <Card>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            Associate Details
          </Typography>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant='body2'>
                <strong>Id: </strong>
                {_id}
              </Typography>
              <Typography variant='body2'>
                <strong>Email: </strong>
                {email}
              </Typography>
              <Typography variant='body2'>
                <strong>Name: </strong>
                {name}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <div style={{ margin: '20px 0px' }}>
        {/* New Shipment Notification */}
        {newShipmentRequest._id ? (
          <ShipmentRequest onAccept={onAccept} onReject={onReject} />
        ) : null}
      </div>
    </div>
  );
};
export default Dashboard;
