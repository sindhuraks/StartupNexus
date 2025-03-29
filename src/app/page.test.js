import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Home from './page';
import '@testing-library/jest-dom'

// Mock the next-auth functions
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
    signIn: jest.fn(),
  }));

// Mock the typewriter effect
jest.mock('typewriter-effect', () => () => <div data-testid="typewriter">Mocked Typewriter</div>);

describe('Home component', () => {

    // Test case to render the logo
    it('renders the logo at the top', () => {
        useSession.mockReturnValue({ data: null });
        render(<Home />);
        expect(screen.getByText('StartupNexus')).toBeInTheDocument();
    });

    // Test case to render the buttons when user is not authenticated
    it('renders sign-in buttons when user is not authenticated', () => {
        useSession.mockReturnValue({ data: null });
        render(<Home />);
        expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
        expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
        expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    // Test case to check if the signIn function is called when the Continue with GitHub button is clicked.
    it('calls signIn function when GitHub button is clicked', () => {
        useSession.mockReturnValue({ data: null });
        render(<Home />);
        fireEvent.click(screen.getByText('Continue with GitHub'));
        expect(require('next-auth/react').signIn).toHaveBeenCalledWith('github', {
          prompt: 'login',
          callbackUrl: '/',
        });
      });
    
    // Test case to check if the signIn function is called when the "Continue with Google" button is clicked.
    it('calls signIn function when Google button is clicked', () => {
    useSession.mockReturnValue({ data: null });
    render(<Home />);
    fireEvent.click(screen.getByText('Continue with Google'));
    expect(require('next-auth/react').signIn).toHaveBeenCalledWith('google', {
        prompt: 'login',
        callbackUrl: '/',
        });
    });
});