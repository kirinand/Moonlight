import React from "react";
import { Fragment, useState } from "react";

import Card from "../../common/components/UIElements/Card";
import Button from "../../common/components/FormElements/Button";
import Modal from "../../common/components/UIElements/Modal";
import "./EventItem.css";

const EventItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteHandler = () => setShowDelete(true);
  const cancelDeleteHandler = () => setShowDelete(false);
  const deleteHandler = () => {
    setShowDelete(false);
    console.log('DELETING...');
  };

  return (
    <Fragment>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="event-item__modal-content"
        footerClass="event-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <h2>MAP</h2>
        </div>
      </Modal>
      <Modal
        show={showDelete}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="event-item__modal-actions"
        footer={
          <Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={deleteHandler}>DELETE</Button>
          </Fragment>
        }
      >
        <p>Delete this event?</p>
      </Modal>
      <li className="event-item">
        <Card className="event-item__content">
          <div className="event-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="event-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="event-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            <Button to={`/events/${props.id}`}>EDIT</Button>
            <Button danger onClick={showDeleteHandler}>DELETE</Button>
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default EventItem;
