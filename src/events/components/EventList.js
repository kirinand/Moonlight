import React from "react";
import Button from "../../common/components/FormElements/Button";

import Card from "../../common/components/UIElements/Card";
import EventItem from "./EventItem";
import "./EventList.css";

const EventList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="event-list center">
        <Card>
          <h2>No event found.</h2>
          <Button to="/events/new">POST EVENTS</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="event-list">
      {props.items.map((event) => (
        <EventItem
          key={event.id}
          id={event.id}
          image={event.imageUrl}
          title={event.title}
          description={event.description}
          address={event.address}
          creatorId={event.creator}
          location={event.location}
        />
      ))}
    </ul>
  );
};

export default EventList;
