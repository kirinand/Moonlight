import React from "react";
import EventList from "../components/EventList";
import { useParams } from "react-router";

const DUMMY_DATA = [
  {
    id: 'e1',
    title: 'Ourdoor Movie Night',
    description: 'Two films and dinner time in between, bring your friends!',
    imageUrl: 'https://dummyimage.com/600x400/000/fff',
    address: '3700 Willingdon Ave, Burnaby, BC V5G 3H2',
    location: {
      lat: 0,
      lng: 0
    },
    creator: 'u1'
  },
  {
    id: 'e2',
    title: 'Ourdoor Movie Night',
    description: 'Two films and dinner time in between, bring your friends!',
    imageUrl: 'https://dummyimage.com/600x400/000/fff',
    address: '3700 Willingdon Ave, Burnaby, BC V5G 3H2',
    location: {
      lat: 0,
      lng: 0
    },
    creator: 'u2'
  }
];

const UserEvents = () => {
  const uid = useParams().uid;
  const loadedEvents = DUMMY_DATA.filter(event => event.creator === uid);
  
  return <EventList items={loadedEvents} />
};

export default UserEvents;