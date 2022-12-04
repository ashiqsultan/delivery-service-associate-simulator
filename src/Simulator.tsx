import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { API_URL, socketEvents } from './constants';
import { getDeliveryAssociate } from './api';
import Dashboard from './Dashboard';
import './simulator.css';
import ShipmentDashboard from './ShipmentDashboard';
import { IShipment, IUpdateDALocation } from './types';
import iconDeliveryAssociate from './assets/icon_delivery_associate.svg';
import iconPickup from './assets/icon_pickup.svg';
import iconDrop from './assets/icon_drop.svg';
import throttle from 'lodash/throttle';

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
const THROTTLE_DELAY = 50;

function Simulator() {
  const params = useParams();
  const [deliveryAssociate, setDeliveryAssociate] = useState({});
  const [shipmentData, setShipmentData] = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [draggable, setDraggable] = useState(true);
  const [position, setPosition] = useState(initialValues.center);
  const { deliveryassociateid } = params;

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
    if (deliveryassociateid) {
      getDADetailsAsync(deliveryassociateid);
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const gpsUpdate = (position: any) => {
    if (position instanceof LatLng) {
      const data: IUpdateDALocation = {
        id: deliveryassociateid || '',
        location: { type: 'Point', coordinates: [position.lng, position.lat] },
      };
      socket.emit(socketEvents.UPDATE_DA_LOCATION, data);
    }
  };

  // deliveryAssociate side effects
  useEffect(() => {
    // Update Marker
    if (Array.isArray(deliveryAssociate?.currentLocation?.coordinates)) {
      const coordinates = deliveryAssociate.currentLocation.coordinates;
      setPosition([coordinates[1], coordinates[0]]);
    }
  }, [deliveryAssociate]);

  // position side effects
  useEffect(() => {
    gpsUpdate(position);
  }, [position]);

  const throttledPositionUpdate = throttle(function (position) {
    console.log('throttled position', position);
    gpsUpdate(position);
  }, THROTTLE_DELAY);

  function DraggableMarker() {
    const markerIcon = L.icon({
      iconUrl: iconDeliveryAssociate,
      iconSize: [35, 35], // size of the icon
      popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
      className: 'marker',
    });
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition(marker.getLatLng());
          }
        },
        drag() {
          const marker = markerRef.current;
          if (marker != null) {
            throttledPositionUpdate(marker.getLatLng());
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
        icon={markerIcon}
      ></Marker>
    );
  }

  const PickUpMarker = () => {
    const markerIcon = L.icon({
      iconUrl: iconPickup,
      iconSize: [70, 50], // size of the icon
      popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
    });
    try {
      const shipment = shipmentData as IShipment;
      const coordinates = shipment?.pickupLocation?.coordinates;
      return Array.isArray(coordinates) ? (
        <Marker position={[coordinates[1], coordinates[0]]} icon={markerIcon}>
          <Popup>Pickup location</Popup>
        </Marker>
      ) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const DropLocationMarker = () => {
    const markerIcon = L.icon({
      iconUrl: iconDrop,
      iconSize: [50, 40], // size of the icon
      popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
    });
    try {
      const shipment = shipmentData as IShipment;
      const coordinates = shipment?.dropLocation?.coordinates;
      return Array.isArray(coordinates) ? (
        <Marker position={[coordinates[1], coordinates[0]]} icon={markerIcon}>
          <Popup>Delivery location</Popup>
        </Marker>
      ) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <div className='container'>
      <div className='col-1'>
        <div>
          <Dashboard
            socket={socket}
            deliveryAssociate={deliveryAssociate}
            setShipmentData={setShipmentData}
          />
          {shipmentData._id ? (
            <ShipmentDashboard
              shipmentData={shipmentData}
              setShipmentData={setShipmentData}
            />
          ) : null}
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
            {shipmentData._id ? <PickUpMarker /> : null}
            {shipmentData._id ? <DropLocationMarker /> : null}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Simulator;
