import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IShipment, ShipmentStatus } from './types';
import { updateShipmentStatus } from './api';

type Props = {
  shipmentData: IShipment;
  setShipmentData: any;
};
const statusDisplayName: Record<ShipmentStatus, string> = {
  [ShipmentStatus.deliveryAssociateAssigned]: 'Delivery Associate Assigned',
  [ShipmentStatus.pickupLocationReached]: 'Reached Pick up location',
  [ShipmentStatus.dropLocationReached]: 'Reached Drop location',
  [ShipmentStatus.transporting]: 'Transporting',
  [ShipmentStatus.delivered]: 'Delivered',
  [ShipmentStatus.requested]: 'Requested',
  [ShipmentStatus.cancelled]: 'Cancelled',
};

type UpdateAction = {
  actionName: string;
  statusToUpdate: ShipmentStatus;
};

const ShipmentDashboard = (props: Props) => {
  const { shipmentData, setShipmentData } = props;
  // Function to determine the next status action based on current status
  const updateAction = (): UpdateAction => {
    const currentStatus: ShipmentStatus = shipmentData.status;
    const pickupLocationReached = {
      actionName: statusDisplayName[ShipmentStatus.pickupLocationReached],
      statusToUpdate: ShipmentStatus.pickupLocationReached,
    };
    const transporting = {
      actionName: statusDisplayName[ShipmentStatus.transporting],
      statusToUpdate: ShipmentStatus.transporting,
    };
    const dropLocationReached = {
      actionName: statusDisplayName[ShipmentStatus.dropLocationReached],
      statusToUpdate: ShipmentStatus.dropLocationReached,
    };
    const delivered = {
      actionName: statusDisplayName[ShipmentStatus.delivered],
      statusToUpdate: ShipmentStatus.delivered,
    };
    let returnObj: UpdateAction;
    switch (currentStatus) {
      case ShipmentStatus.deliveryAssociateAssigned:
        returnObj = pickupLocationReached;
        break;
      case ShipmentStatus.pickupLocationReached:
        returnObj = transporting;
        break;
      case ShipmentStatus.transporting:
        returnObj = dropLocationReached;
        break;
      case ShipmentStatus.dropLocationReached:
        returnObj = delivered;
        break;
      default:
        returnObj = delivered;
        break;
    }
    return returnObj;
  };

  const onShipmentStatusUpdate = async (statusToUpdate: ShipmentStatus) => {
    const updatedShipmentData = await updateShipmentStatus(
      shipmentData._id,
      statusToUpdate
    );
    setShipmentData(updatedShipmentData.data);
  };
  return (
    <>
      {shipmentData._id ? (
        <>
          <Typography variant='h6'>Shipment details</Typography>
          <Typography variant='body1' gutterBottom>
            <strong>Id</strong>: {shipmentData?._id}
          </Typography>
          <Typography variant='body1' gutterBottom>
            <strong>Current Status</strong>:{' '}
            {statusDisplayName[shipmentData.status]}
          </Typography>
          <Typography variant='h6' gutterBottom>
            Update Shipment Status
          </Typography>
          <Button
            variant='contained'
            size='large'
            onClick={async () => {
              await onShipmentStatusUpdate(updateAction().statusToUpdate);
            }}
          >
            {updateAction().actionName}
          </Button>
        </>
      ) : null}
    </>
  );
};
export default ShipmentDashboard;
