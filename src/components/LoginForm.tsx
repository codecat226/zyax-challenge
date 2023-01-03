import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../services/userServices';
import { LoginData } from '../types/userTypes';

const LoginForm = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await loginUser(data);
      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.accessToken);
        toast.success('login successful');
        setLoggedIn(true);
        reset();
      }
    } catch (err: any) {
      toast.error(err.response.data.error);
      reset();
    }
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem('accessToken');
      setLoggedIn(false);
      toast.success('logout successful');
    } catch (error) {
      toast.error('Could not logout');
    }
  };

  return (
    <main>
      <ToastContainer />
      <form data-testid="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h1>User Login:</h1>
        <div className="form__input">
          <input
            type="text"
            id="email"
            placeholder="Email Address"
            data-testid="email"
            {...register('email', { required: 'Email address is required' })}
          />
          {errors.email && (
            <span className="errorMsg" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="form__input">
          <input
            type="password"
            id="password"
            placeholder="Password"
            data-testid="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <span className="errorMsg" role="alert">
              {errors.password.message}
            </span>
          )}
        </div>
        {loggedIn === false ? (
          <button className="submitBtn" type="submit">
            Login
          </button>
        ) : (
          <button data-testid="logoutBtn" className="submitBtn" onClick={logoutUser}>
            Logout
          </button>
        )}
      </form>
    </main>
  );
};

export default LoginForm;
