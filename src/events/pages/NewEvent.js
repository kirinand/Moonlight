import React from 'react';

import Input from '../../common/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../common/Utility/validators';
import Button from '../../common/components/FormElements/Button';
import { useForm } from '../../common/hooks/form-hook';
import './EventForm.css';

const NewEvent = () => {
  const [formState, inputHandler] = useForm({
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
  }, false);

  const eventSubmitHandler = e => {
    e.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  return (
    <form className="event-form" onSubmit={eventSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a description at least 5 characters."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD EVENT
      </Button>
    </form>
  );
};

export default NewEvent;
