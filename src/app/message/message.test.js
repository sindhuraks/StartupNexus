
// src/app/message/message.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Message from './page'; // Adjust if your file is named differently
describe('Message Page', () => {
  test('renders conversation list with users', () => {
    render(<Message />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });
  test('renders initial chat messages for default user', () => {
    render(<Message />);
    // John Doe is selected by default
    expect(screen.getByText('Hey John, ready for our meeting?')).toBeInTheDocument();
    expect(screen.getByText('Absolutely! See you then.')).toBeInTheDocument();
  });
  test('can switch to another user conversation', () => {
    render(<Message />);
    // Find and click the Jane Smith conversation item
    const conversationItems = screen.getAllByText('Jane Smith');
    const janeConversation = conversationItems[0].closest('.conversationItem');
    fireEvent.click(janeConversation);
    
    // Should show Jane's conversation
    expect(screen.getByText('Hi Jane, did you review the PR?')).toBeInTheDocument();
    expect(screen.getByText('Yes, looks good to me!')).toBeInTheDocument();
  });
  test('can send a new message', () => {
    render(<Message />);
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    // Find the send button in the chat window (not the modal)
    const sendButtons = screen.getAllByText('Send');
    const chatSendButton = sendButtons.find(button => 
      !button.classList.contains('sendButton')
    );
    fireEvent.click(chatSendButton);
    
    // The message should appear in the conversation
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
  test('can open and close the compose modal', () => {
    render(<Message />);
    fireEvent.click(screen.getByText('Compose'));
    expect(screen.getByText('New Message')).toBeInTheDocument();
    
    // Find the close button by aria-label
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    // Modal should be closed now
    expect(screen.queryByText('New Message')).not.toBeInTheDocument();
  });
  test('compose modal disables send if no recipient or message', () => {
    render(<Message />);
    fireEvent.click(screen.getByText('Compose'));
    
    // Use more specific selector to get the disabled send button
    const modalSendButton = screen.getAllByText('Send')
      .find(button => button.closest('.composeModalFooter'));
    
    expect(modalSendButton).toBeDisabled();
  });
  test('compose modal can search and select recipient', () => {
    render(<Message />);
    fireEvent.click(screen.getByText('Compose'));
    
    // Find search input in modal
    const searchInput = screen.getByPlaceholderText('Search connections...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    
    // Find Jane in search results (in composeSearchResultItem)
    const janeResultItems = screen.getAllByText('Jane Smith');
    const janeInResults = janeResultItems.find(element => 
      element.closest('.composeSearchResultItem')
    );
    
    fireEvent.click(janeInResults);
    
    // After clicking, selected recipient should show with role
    expect(screen.getByText(/Jane Smith - Tech Lead/)).toBeInTheDocument();
  });
});