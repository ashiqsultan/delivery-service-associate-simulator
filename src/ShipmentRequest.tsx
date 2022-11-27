import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { updateShipmentStatus, updateShipmentDeliveryAssociate } from './api';
import { ShipmentStatus } from './types';
const style = {
  display: 'flex',
  justifyContent: 'space-evenly',
};

type Props = {
  shipmentData: object;
  setNewShipmentRequest: any;
};
const ShipmentRequest = (props: Props) => {
  const params = useParams();
  const { deliveryassociateid } = params;
  const onAccept = () => {
    updateShipmentStatus(
      props.shipmentData?._id,
      ShipmentStatus.deliveryAssociateAssigned
    );
    updateShipmentDeliveryAssociate(
      props.shipmentData?._id,
      deliveryassociateid
    );
    props.setNewShipmentRequest({});
  };
  const onReject = () => {
    props.setNewShipmentRequest({});
  };
  return (
    <div style={{ padding: '0 100px 0' }}>
      <Card>
        <CardContent>
          <div style={style}>
            <Typography variant='h5'>New Shipment Available</Typography>
          </div>
          <div style={{ ...style, marginTop: '20px' }}>
            <Button
              variant='contained'
              color='success'
              size='medium'
              onClick={onAccept}
            >
              Accept
            </Button>
            <Button
              variant='contained'
              color='error'
              size='medium'
              onClick={onReject}
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ShipmentRequest;
