import React from 'react';
import axios, { AxiosError } from 'axios';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './components/LoginForm';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginForm', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render form with blank inputs', () => {
    render(<Login />);
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveFormValues({
      email: '',
      password: ''
    });
  });

  it('should display error message if blank email submitted', async () => {
    render(<Login />);
    const email = await screen.findByRole('textbox');
    const loginBtn = await screen.findByRole('button', {
      name: /login/i
    });

    fireEvent.change(email, { target: { value: '' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByText('Email address is required')).toBeInTheDocument();
    });
  });

  it('should display error message if blank password submitted', async () => {
    render(<Login />);

    const password = await screen.findByPlaceholderText('Password');
    const loginBtn = await screen.findByRole('button', {
      name: /login/i
    });

    fireEvent.change(password, { target: { value: '' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should display an error message if the login fails', async () => {
    render(<Login />);

    const email = await screen.findByRole('textbox');
    const password = await screen.findByPlaceholderText('Password');
    const loginBtn = await screen.findByRole('button', {
      name: /login/i
    });

    fireEvent.change(email, { target: { value: 'email' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(loginBtn);

    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          error: 'No access'
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('No access')).toBeInTheDocument();
    });
  });

  it('should display a success message if login successful', async () => {
    render(<Login />);

    const email = await screen.findByRole('textbox');
    const password = await screen.findByPlaceholderText('Password');
    const loginBtn = await screen.findByRole('button', {
      name: /login/i
    });

    fireEvent.change(email, { target: { value: 'email' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(loginBtn);

    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { accessToken: 'eYagkaogk...', refreshToken: 'eyAagga...' }
      })
    );

    await waitFor(() => {
      expect(screen.getByText('login successful')).toBeInTheDocument();
    });
  });

  it('should save accessToken to localStorage if login successful', async () => {
    render(<Login />);

    const email = await screen.findByRole('textbox');
    const password = await screen.findByPlaceholderText('Password');
    const loginBtn = await screen.findByRole('button', {
      name: /login/i
    });

    fireEvent.change(email, { target: { value: 'email' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(loginBtn);

    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { accessToken: 'eYagkaogk...', refreshToken: 'eyAagga...' }
      })
    );
    const setItem = jest.spyOn(Storage.prototype, 'setItem');

    await waitFor(() => {
      expect(setItem).toHaveBeenCalledWith('accessToken', 'eYagkaogk...');
    });
  });

  it('should display logout message on logout', async () => {
    render(<Login />);

    const email = await screen.findByRole('textbox');
    const password = await screen.findByPlaceholderText('Password');
    const loginBtn = await screen.findByRole('button', {
      name: /login/i
    });

    fireEvent.change(email, { target: { value: 'email' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(loginBtn);

    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { accessToken: 'eYagkaogk...', refreshToken: 'eyAagga...' }
      })
    );

    const setItem = jest.spyOn(Storage.prototype, 'setItem');

    await waitFor(() => {
      expect(setItem).toHaveBeenCalledWith('accessToken', 'eYagkaogk...');
    });

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));

    const logoutBtn = await screen.findByRole('button', {
      name: /logout/i
    });

    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByText('logout successful')).toBeInTheDocument();
    });
  });

  it('should remove accessToken from localStorage on logout', async () => {
    render(<Login />);

    const email = await screen.findByRole('textbox');
    const password = await screen.findByPlaceholderText('Password');
    const loginBtn = await screen.findByRole('button', {
      name: /login/i
    });

    fireEvent.change(email, { target: { value: 'email' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(loginBtn);

    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { accessToken: 'eYagkaogk...', refreshToken: 'eyAagga...' }
      })
    );

    const logoutBtn = await screen.findByRole('button', {
      name: /logout/i
    });
    const removeItem = jest.spyOn(Storage.prototype, 'removeItem');

    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByText('logout successful')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(removeItem).toHaveBeenCalledWith('accessToken');
    });
  });
});
