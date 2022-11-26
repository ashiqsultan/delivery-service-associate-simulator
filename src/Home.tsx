import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [deliveryAssociateId, setDeliveryAssociateId] = useState(null);

  const navigateToSimulator = () => {
    if (deliveryAssociateId) {
      navigate(`/simulator/${deliveryAssociateId}`);
    }
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      navigateToSimulator();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h3' gutterBottom>
          Delivery Associate Simulator
        </Typography>
      </div>
      <div>
        <Card>
          <CardContent>
            <div>
              <div>
                <div style={{ display: 'flex', paddingTop: '20px' }}>
                  <TextField
                    label='Delivery Associate Id'
                    variant='standard'
                    style={{ flexGrow: '1' }}
                    value={deliveryAssociateId}
                    onChange={(event) =>
                      setDeliveryAssociateId(event.target.value)
                    }
                    onKeyDown={keyPress}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', paddingTop: '30px' }}>
                <Button
                  variant='contained'
                  size='large'
                  onClick={navigateToSimulator}
                >
                  Go
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
