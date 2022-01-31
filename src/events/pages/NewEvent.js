import React, { useCallback, useReducer } from 'react';

import Input from '../../common/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../common/Utility/validators';
import './NewEvent.css';

const formReducer = (state, action) => {};

const NewEvent = () => {
  useReducer(formReducer, {

  });

  const titleInputHandler = useCallback((id, value, isValid) => {
  }, []);

  const descriptionInputHandler = useCallback((id, value, isValid) => {
  }, []);

  return (
    <form className="event-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={titleInputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a description at least 5 characters."
        onInput={descriptionInputHandler}
      />
    </form>
  );
};

export default NewEvent;
