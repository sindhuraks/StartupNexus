import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Dashboard from './page';
import '@testing-library/jest-dom';
import ViewProfile from '../view-profile/page';

// Mock fetch
global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ status: 'success' }),
}));

// Mock useSession
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { email: 'johndoe@gmail..com' } }, status: 'authenticated' }),
}));

// Mock useForm
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    reset: jest.fn(),
  }),
}));

describe('Dashboard component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    jest.clearAllMocks();
  });

    it('renders start a post button when user is authenticated', () => {
        render(<Dashboard />);
        expect(screen.getByText('Start a post')).toBeInTheDocument();
    });

    // Test case to render the start a post form when Start a post is clciked
    it('renders create a post form when user click user clicks Start a post', () => {
        render(<Dashboard />);
        fireEvent.click(screen.getByText('Start a post'));
        expect(screen.getByText('Create a post')).toBeInTheDocument();
        expect(screen.getByText('Startup Name:')).toBeInTheDocument();
        expect(screen.getByText('Industry:')).toBeInTheDocument();
        expect(screen.getByText('Description:')).toBeInTheDocument();
        expect(screen.getByText('Budget:')).toBeInTheDocument();
        expect(screen.getByText('Timeframe:')).toBeInTheDocument();
    });

    it('renders View Profile when user clicks View Profile button', () => {
        render(<ViewProfile />);
        expect(screen.getByText('Upload Profile Picture')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('Experience')).toBeInTheDocument();
    });

    // Test case to handle post creation
    it('should handle post creation', async () => {
        const { result } = renderHook(() => {
        const [posts, setPosts] = React.useState([]);
        const [postModalVisible, setPostModalVisible] = React.useState(false);
        const { register, handleSubmit, reset } = useForm();

        const onSubmit = async (data) => {
        // Simulate the onSubmit function from the Dashboard component
        const postData = {
            entrepreneur_email: 'johndoe@gmail.com',
            startup_name: data.startupName,
            industry: data.industry,
            description: data.description,
            budget: parseFloat(data.budget),
            timeframe: data.timeframe,
        };

        try {
            const response = await fetch('http://localhost:8080/v1/startup/insert', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
            });

            if (response.ok) {
            setPostModalVisible(false);
            reset();
            } else {
            throw new Error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
        };

        return { onSubmit, setPosts, setPostModalVisible, postModalVisible };
    });

    const data = {
        startupName: 'AI innovations',
        industry: 'AI',
        description: 'AI driven innovations part 1',
        budget: '1000',
        timeframe: '6 months',
    };

    await act(async () => {
        await result.current.onSubmit(data);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.current.postModalVisible).toBe(false);
    });

    // Test case to handle post display
    it('should handle post display', async () => {
        const { result } = renderHook(() => {
        const [posts, setPosts] = React.useState([]);
        const handleDisplayPost = async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/startup/all');

            if (response.ok) {
            const data = await response.json();
            setPosts(data.startups || []);
            } else {
            throw new Error('Failed to display post');
            }
        } catch (error) {
            console.error('Error displaying post:', error);
        }
        };

        return { handleDisplayPost, setPosts, posts };
        });

        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                startups: [
                { id: 1, name: 'AI innovations', description: 'AI driven innovations part 1', industry: 'AI', budget: '1000', timeframe: '6 months' },
                ],
            }),
            }));

        await act(async () => {
            await result.current.handleDisplayPost();
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.current.posts).toEqual([{ id: 1, name: 'AI innovations', description: 'AI driven innovations part 1', industry: 'AI', budget: '1000', timeframe: '6 months' }]);
    });

    // Test case to handle post deletion
    it('should handle post deletion', async () => {
        const { result } = renderHook(() => {
        const [posts, setPosts] = React.useState([{ id: 1, name: 'AI innovations' }]);
        const handleDeletePost = async (postId) => {
        try {
            const response = await fetch('http://localhost:8080/v1/startup/delete', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: 'johndoe@gmail.com', startup_id: postId }),
            });

            if (response.ok) {
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            } else {
            throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        };

        return { handleDeletePost, setPosts, posts };
        });

        await act(async () => {
        await result.current.handleDeletePost(1);
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.current.posts).toEqual([]);
    });

    // Test case to handle post updation
    it('should handle post updation', async () => {
        const { result } = renderHook(() => {
        const [posts, setPosts] = React.useState([{ id: 1, name: 'AI Innovations', timeframe: '6 months' }]);
        const handleUpdatePost = async (postId, data) => {
        try {
            const response = await fetch('http://localhost:8080/v1/startup/update', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: 'johndoe@gmail.com', startup_id: postId, ...data }),
            });

            if (response.ok) {
            setPosts((prevPosts) => prevPosts.map((post) => post.id === postId ? { ...post, ...data } : post));
            } else {
            throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
        };

        return { handleUpdatePost, setPosts, posts };
    });

    const data = {
        name: 'AI Innovations',
        timeframe: '8 months',
    };

    await act(async () => {
        await result.current.handleUpdatePost(1, data);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.current.posts).toEqual([{ id: 1, name: 'AI Innovations', timeframe: '8 months' }]);
    });
});