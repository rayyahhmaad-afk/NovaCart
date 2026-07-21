import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import React from 'react';
import axios from 'axios';

// Mock axios properly
vi.mock('axios', () => {
    return {
        default: {
            create: vi.fn(() => ({
                interceptors: {
                    request: { use: vi.fn(), eject: vi.fn() },
                    response: { use: vi.fn(), eject: vi.fn() }
                },
                get: vi.fn(),
                post: vi.fn(),
                put: vi.fn(),
                delete: vi.fn(),
            }))
        }
    };
});

const TestComponent = () => {
    const { user, token } = useAuth();
    return (
        <div>
            <div data-testid="user">{user ? user.name : 'no user'}</div>
            <div data-testid="token">{token ? 'has token' : 'no token'}</div>
        </div>
    );
};

describe('AuthContext', () => {
    it('provides default unauthenticated state', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('user').textContent).toBe('no user');
        expect(screen.getByTestId('token').textContent).toBe('no token');
    });
});
