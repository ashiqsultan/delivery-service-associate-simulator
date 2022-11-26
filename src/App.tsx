import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import './App.css';
import { API_URL } from './constants';

const initialValues: {
  zoom: number;
  center: [number, number];
  scrollWheelZoom: boolean;
} = {
  zoom: 15,
  center: [13.092123232608643, 80.28222309087568],
  scrollWheelZoom: true,
};

const socket = io(API_URL, {
  extraHeaders: {
    // 'my-custom-header': 'foo',
  },
});

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [draggable, setDraggable] = useState(true);
  const [position, setPosition] = useState(initialValues.center);

  // TODO
  // Need functionality to use the simulator for different driverIds
  // Try using routes and get driver id

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  useEffect(() => {
    // TODO
    // Initiate socket connection
    // setPosition
    // update Driver details for popup
  }, []);

  useEffect(() => {
    // TODO
    // Send Updated position via socket
  }, [position]);

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
    <MapContainer className='leaflet-container' {...initialValues}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <DraggableMarker />
    </MapContainer>
  );
}

export default App;
