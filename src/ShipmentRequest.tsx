import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const style = {
  display: 'flex',
  justifyContent: 'space-evenly',
};

type Props = {
  onAccept: any;
  onReject: any;
};
const ShipmentRequest = (props: Props) => {
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
              onClick={props.onAccept}
            >
              Accept
            </Button>
            <Button
              variant='contained'
              color='error'
              size='medium'
              onClick={props.onReject}
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
