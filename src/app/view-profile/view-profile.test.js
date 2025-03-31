import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import ViewProfile from './page';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ startups: [] }),
  }));
  
// Mock useSession
jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: { user: { email: 'johndoe@gmail.com', name:'John Doe' } }, status: 'authenticated' }),
}));

// Test case to render user details
it('displays user information when authenticated', () => {
    render(<ViewProfile />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('284 connections')).toBeInTheDocument();
    expect(screen.getByText('Upload Profile Picture')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
});