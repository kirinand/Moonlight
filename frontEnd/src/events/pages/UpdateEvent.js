import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../common/components/FormElements/Input';
import Button from '../../common/components/FormElements/Button';
import Card from '../../common/components/UIElements/Card';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../common/Utility/validators';
import { useForm } from '../../common/hooks/form-hook';
import './EventForm.css';

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
    title: 'Campus Movie Night',
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

const UpdateEvent = () => {
  const eventId = useParams().eventId;
  const [isLoading, setIsLoading] = useState(true);

  const [formState, inputHandler, setFormData] = useForm({
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      }
    }, true);

  const identifiedEvent = DUMMY_DATA.find(event => event.id === eventId);

  useEffect(() => {
    if (identifiedEvent) {
        setFormData({
        title: {
          value: identifiedEvent.title,
          isValid: true
        },
        description: {
          value: identifiedEvent.description,
          isValid: true
        },
        address: {
          value: identifiedEvent.address,
          isValid: true
        }
      }, true);
    }
    setIsLoading(false);
  }, [setFormData, identifiedEvent]);
  

  const eventUpdateSubmitHandler = e => {
    e.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  if (!identifiedEvent) {
    return (
      <div className="center">
        <Card> 
          <h2>Event does not exist.</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="event-form" onSubmit={eventUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        value={formState.inputs.title.value}
        valid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        value={formState.inputs.description.value}
        valid={formState.inputs.description.isValid}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
        value={formState.inputs.address.value}
        valid={formState.inputs.address.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdateEvent;
