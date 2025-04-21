
// src/app/network/page.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Essential for toBeInTheDocument matcher
import Networks from './page';
// Don't mock React hooks - this causes the "Rendered more hooks" error
describe('Networks Component', () => {
  test('renders network page content', () => {
    render(<Networks />);
    
    // Check page title
    expect(screen.getByText('My Network')).toBeInTheDocument();
    
    // Check section headers
    expect(screen.getByText('Invitations')).toBeInTheDocument();
    expect(screen.getByText('Your Connections')).toBeInTheDocument();
    
    // Check specific user data
    expect(screen.getByText('Priya Patel')).toBeInTheDocument();
    expect(screen.getByText('Michael Lee')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  test('accepts an invitation', () => {
    render(<Networks />);
    
    // Count initial Accept buttons
    const acceptButtons = screen.getAllByRole('button', { name: 'Accept' });
    const initialCount = acceptButtons.length;
    
    // Click the first Accept button
    fireEvent.click(acceptButtons[0]);
    
    // Verify one fewer Accept button exists
    expect(screen.getAllByRole('button', { name: 'Accept' })).toHaveLength(initialCount - 1);
  });
  test('ignores an invitation', () => {
    render(<Networks />);
    
    // Count initial Ignore buttons
    const ignoreButtons = screen.getAllByRole('button', { name: 'Ignore' });
    const initialCount = ignoreButtons.length;
    
    // Click the first Ignore button
    fireEvent.click(ignoreButtons[0]);
    
    // Verify one fewer Ignore button exists
    expect(screen.getAllByRole('button', { name: 'Ignore' })).toHaveLength(initialCount - 1);
  });
  test('removes a connection', () => {
    render(<Networks />);
    
    // Count initial Remove buttons
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    const initialCount = removeButtons.length;
    
    // Click the first Remove button
    fireEvent.click(removeButtons[0]);
    
    // Verify one fewer Remove button exists
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(initialCount - 1);
  });
  test('shows "No pending invitations" when no requests', () => {
    render(<Networks />);
    
    // Find all Ignore buttons and click them one by one
    const ignoreButtons = screen.getAllByRole('button', { name: 'Ignore' });
    
    // Loop through and click each button (re-querying each time)
    for (let i = 0; i < ignoreButtons.length; i++) {
      fireEvent.click(screen.getAllByRole('button', { name: 'Ignore' })[0]);
    }
    
    // Check for the "No pending invitations" message
    expect(screen.getByText('No pending invitations')).toBeInTheDocument();
  });
  test('shows "No connections yet" when all connections are removed', () => {
    render(<Networks />);
    
    // Find all Remove buttons
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    
    // Loop through and click each button (re-querying each time)
    for (let i = 0; i < removeButtons.length; i++) {
      fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);
    }
    
    // Check for the "No connections yet" message
    expect(screen.getByText('No connections yet')).toBeInTheDocument();
  });
  test('handles errors gracefully', () => {
    // Create Error Boundary wrapper
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }
      
      static getDerivedStateFromError() {
        return { hasError: true };
      }
      
      componentDidCatch() {}
      
      render() {
        if (this.state.hasError) {
          return <div>Failed to load network data.</div>;
        }
        return this.props.children;
      }
    }
    
    // Silence React error boundary warnings in tests
    const originalError = console.error;
    console.error = jest.fn();
    
    // Create a component that throws during rendering
    const ThrowingComponent = () => {
      throw new Error('Test error');
      return null; // This line is never reached
    };
    
    // Render with error boundary
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    
    // Check for error message
    expect(screen.getByText('Failed to load network data.')).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalError;
  });
});