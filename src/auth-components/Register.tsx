import { Link } from 'react-router-dom';
import React, { ComponentProps, useState } from 'react';
import { Requests } from '../api';
import toast from 'react-hot-toast';
import { useAuthInfo } from '../providers/AuthProvider';
import { ErrorMessage } from '../components/errorMessages';
import { isEmailValid, isZipcodeValid } from '../utils/validations';
import { useNavigate } from 'react-router-dom';
import * as _ from 'lodash-es';
import { faker, id_ID } from '@faker-js/faker';
import { User } from '../types';

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
  const { user, setUser } = useAuthInfo();
  const { username, email, password, address } = user;
  const { street, city, state, zipcode } = address;
  const [confirm, setConfirm] = useState('');
  const [userNameExists, setUserNameExists] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [takenName, setTakenName] = useState('');

  const existsErrorMessage = `Username ${takenName} already exists`;
  const emailErrorMessage = 'Email is Invalid';
  const zipcodeErrorMessage = 'Zip code is Invalid.';
  const navigate = useNavigate();

  const findReps = async (addressString: string) => {
    return await Requests.getCongressMembersFromFive(addressString).then(
      (reps) => reps
    );
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    const reps = await findReps(String(Object.values(address)));
    if (!reps) {
      return 'not a valid address';
    }
    return Requests.register(username, email, password, address)
      .then(() => {
        setIsFormSubmitted(false);
        setTakenName('');
        console.log(reps);
        toast.success('Registration successful');
        Requests.loginUser({ username: username, password: password })
          .then((data) => {
            localStorage.clear();
            localStorage.setItem('user', JSON.stringify(data.userInfo));
            localStorage.setItem('token', JSON.stringify(data.token));
          })
          .catch((e) => console.error('login error:', e.message));

        navigate('/App', { state: { address } });
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
      },
      vote_log: {}
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
            const generatedUser = generateUser() as User;
            setUser(generatedUser);
            setConfirm(generatedUser.password);
          }}
        >
          Generate User
        </button>
        <RegisterInput
          labelText="Username"
          inputProps={{
            placeholder: 'Boogey',
            onChange: (e) => setUser({ ...user, username: e.target.value }),
            value: username
          }}
        />
        {isFormSubmitted &&
          (takenName === username ? (
            <ErrorMessage message={existsErrorMessage} show={userNameExists} />
          ) : null)}
        <RegisterInput
          labelText="Email"
          inputProps={{
            placeholder: 'HarrietT@email.com',
            onChange: (e) => setUser({ ...user, email: e.target.value }),
            value: email
          }}
        />
        {isFormSubmitted && (
          <ErrorMessage
            message={emailErrorMessage}
            show={!isEmailValid(email)}
          />
        )}
        <RegisterInput
          labelText="Password"
          inputProps={{
            placeholder: 'Password',
            onChange: (e) => setUser({ ...user, password: e.target.value }),
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
              setUser({
                ...user,
                address: { ...user.address, street: e.target.value }
              }),
            value: street
          }}
        />

        <RegisterInput
          labelText={`City or Town`}
          inputProps={{
            placeholder: 'New York',
            onChange: (e) =>
              setUser({
                ...user,
                address: {
                  ...user.address,
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
              setUser({
                ...user,
                address: { ...user.address, state: e.target.value }
              }),
            value: state
          }}
        />
        <RegisterInput
          labelText={`Zipcode`}
          inputProps={{
            placeholder: '12345',
            onChange: (e) =>
              setUser({
                ...user,
                address: { ...user.address, zipcode: e.target.value }
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
