import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { API_URL } from './constants';
import { getDeliveryAssociate } from './api';
import Dashboard from './Dashboard';
import './simulator.css';

const initialValues: {
  zoom: number;
  center: [number, number];
  scrollWheelZoom: boolean;
} = {
  zoom: 15,
  center: [13.092123232608643, 80.28222309087568],
  scrollWheelZoom: true,
};

const mapContainerStyle = {
  width: '100%',
  height: '99vh',
};

const socket = io(API_URL);

function Simulator() {
  const params = useParams();
  const [deliveryAssociate, setDeliveryAssociate] = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [draggable, setDraggable] = useState(true);
  const [position, setPosition] = useState(initialValues.center);

  useEffect(() => {
    const getDADetailsAsync = async (id: string) => {
      const response = await getDeliveryAssociate(id);
      setDeliveryAssociate(response.data);
    };

    // Establish Socket
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Set Delivery Associate Info
    const { deliveryassociateid } = params;
    if (deliveryassociateid) {
      getDADetailsAsync(deliveryassociateid);
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  // deliveryAssociate side effects
  useEffect(() => {
    // Update Marker
    if (Array.isArray(deliveryAssociate?.currentLocation?.coordinates)) {
      const coordinates = deliveryAssociate.currentLocation.coordinates;
      setPosition([coordinates[1], coordinates[0]]);
    }
  }, [deliveryAssociate]);

  function DraggableMarker() {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition(marker.getLatLng());
          }
        },
      }),
      []
    );

    return (
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      >
        <Popup minWidth={200}>
          <span>Driver details</span>
        </Popup>
      </Marker>
    );
  }

  return (
    <div className='container'>
      <div className='col-1'>
        <div>
          <Dashboard socket={socket} deliveryAssociate={deliveryAssociate} />
        </div>
      </div>
      <div className='col-2'>
        <div>
          <MapContainer style={mapContainerStyle} {...initialValues}>
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <DraggableMarker />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Simulator;
