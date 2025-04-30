import { Link } from 'react-router-dom';
import React, { ComponentProps, useState } from 'react';
import { Requests } from '../api';
import toast from 'react-hot-toast';
import { useAuthInfo } from '../providers/AuthProvider';
import { ErrorMessage } from '../components/errorMessages';
import { isZipcodeValid } from '../utils/validations';
import { useNavigate } from 'react-router-dom';
import * as _ from 'lodash-es';
import { faker } from '@faker-js/faker';
import { useDisplayBills } from '../providers/BillProvider';
import { FrontEndRegistrant } from '../types';
export function RegisterInput({
  labelText,
  inputProps
}: {
  labelText: string;
  inputProps: ComponentProps<'input'>;
}) {
  return (
    <div className="input-wrap">
      <label>{labelText}:</label>

      <input {...inputProps} />
    </div>
  );
}

export const Register = () => {
  const { setUser } = useAuthInfo();
  const { setVoteLog } = useDisplayBills();

  const [frontEndRegistrant, setFrontEndRegistrant] = useState({
    username: '',
    email: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: ''
    }
  });
  const { username, email, password, address } = frontEndRegistrant;
  const { street, city, state, zipcode } = address;
  const [confirm, setConfirm] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const zipcodeErrorMessage = 'Zip code is Invalid.';
  const navigate = useNavigate();

  const findReps = async (addressString: string) => {
    return await Requests.getCongressMembersFromFive(
      String(Object.values(address))
    ).then((reps) => reps);
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    return Requests.register(username, email, password, address)
      .then((message) => {
        if (typeof message === 'string') {
          setErrorMessage(message);
          throw Error;
        }
        console.log('register m', message);
        setIsFormSubmitted(false);

        toast.success('Registration successful');
        Requests.loginUser({ username: username, password: password })
          .then(async (data) => {
            localStorage.clear();
            localStorage.setItem('user', JSON.stringify(data.userInfo));
            localStorage.setItem('token', JSON.stringify(data.token));
            await setUser(data.userInfo);
            const userLog = await Requests.getVoteLog(data.token);
            setVoteLog(userLog);
          })
          .catch((e) => console.error('login error:', e.message));

        navigate('/App', { state: { address, username } });
      })
      .catch((error) => {
        console.error('Fetch error:', error.message);
      });
  };
  const generateUser = () => {
    const capitalize = _.capitalize;
    return {
      username: capitalize(faker.internet.userName()),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: {
        street: faker.location.streetAddress(),
        city: capitalize(faker.location.city()),
        state: faker.location.state(),
        zipcode: faker.location.zipCode()
      }
    };
  };

  return (
    <div className="register">
      <Link to="/">
        <button type="submit">Home</button>
      </Link>

      <form className="register-field" onSubmit={handleRegister}>
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            const generatedUser = generateUser();
            setFrontEndRegistrant(generatedUser as FrontEndRegistrant);
            setConfirm(generatedUser.password);
          }}
        >
          Generate User
        </button>
        <RegisterInput
          labelText="Username"
          inputProps={{
            placeholder: 'Boogey',
            onChange: (e) =>
              setFrontEndRegistrant({
                ...frontEndRegistrant,
                username: e.target.value
              }),
            value: username
          }}
        />
        {isFormSubmitted && (
          <ErrorMessage
            message={errorMessage}
            show={errorMessage.includes(username)}
          />
        )}
        <RegisterInput
          labelText="Email"
          inputProps={{
            placeholder: 'HarrietT@email.com',
            onChange: (e) =>
              setFrontEndRegistrant({
                ...frontEndRegistrant,
                email: e.target.value
              }),
            value: email
          }}
        />
        {isFormSubmitted && (
          <ErrorMessage
            message={errorMessage}
            show={errorMessage.includes('email')}
          />
        )}
        <RegisterInput
          labelText="Password"
          inputProps={{
            placeholder: 'Password',
            onChange: (e) =>
              setFrontEndRegistrant({
                ...frontEndRegistrant,
                password: e.target.value
              }),
            value: password
          }}
        />
        <RegisterInput
          labelText="Confirm Password"
          inputProps={{
            placeholder: 'Confirm Password',
            onChange: (e) => {
              setConfirm(e.target.value);
            },
            value: confirm
          }}
        />
        {isFormSubmitted && (
          <ErrorMessage
            message={'Passwords do not match'}
            show={!!password && password !== confirm}
          />
        )}
        <div className="address-prompt">
          Give us your address and we'll find your representatives for you.
        </div>
        <RegisterInput
          labelText={`Street Address`}
          inputProps={{
            placeholder: '123 Main St.',
            onChange: (e) =>
              setFrontEndRegistrant({
                ...frontEndRegistrant,
                address: {
                  ...frontEndRegistrant.address,
                  street: e.target.value
                }
              }),
            value: street
          }}
        />

        <RegisterInput
          labelText={`City or Town`}
          inputProps={{
            placeholder: 'New York',
            onChange: (e) =>
              setFrontEndRegistrant({
                ...frontEndRegistrant,
                address: {
                  ...frontEndRegistrant.address,
                  city: e.target.value
                }
              }),
            value: city
          }}
        />
        <RegisterInput
          labelText={`State`}
          inputProps={{
            placeholder: 'NY',
            onChange: (e) =>
              setFrontEndRegistrant({
                ...frontEndRegistrant,
                address: {
                  ...frontEndRegistrant.address,
                  state: e.target.value
                }
              }),
            value: state
          }}
        />
        <RegisterInput
          labelText={`Zipcode`}
          inputProps={{
            placeholder: '12345',
            onChange: (e) =>
              setFrontEndRegistrant({
                ...frontEndRegistrant,
                address: {
                  ...frontEndRegistrant.address,
                  zipcode: e.target.value
                }
              }),
            value: zipcode
          }}
        />
        {isFormSubmitted && (
          <ErrorMessage
            message={zipcodeErrorMessage}
            show={!isZipcodeValid(zipcode)}
          />
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
