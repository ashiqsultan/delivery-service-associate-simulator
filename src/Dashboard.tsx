import Typography from '@mui/material/Typography';
import { IDeliveryAssociate } from './types';

type Props = {
  deliveryAssociate: IDeliveryAssociate;
};
const Dashboard = (props: Props) => {
  const { name, email, status } = props.deliveryAssociate;
  return (
    <div>
      <Typography gutterBottom>{name}</Typography>
      <Typography gutterBottom>{status}</Typography>
    </div>
  );
};
export default Dashboard;
