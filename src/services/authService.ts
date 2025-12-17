import { BaseService } from '../core';
import { httpClient } from '../core/httpClient';
import { secureStorage } from '../utils/secureStorage';
import { LoginCredentials, LoginCredentialsSchema, UserProfile } from '../utils/validation';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
  expiresIn: number;
}

/**
 * AUTHENTICATION SERVICE
 * 
 * Handles:
 * 1. Login/Logout
 * 2. Token Management (Storage)
 * 3. Session Persistence
 */
class AuthService extends BaseService {
  
  public async login(credentials: LoginCredentials): Promise<UserProfile> {
    return this.circuitBreaker.execute(async () => {
      // 1. Validation
      const validation = LoginCredentialsSchema.safeParse(credentials);
      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      // 2. Mock API Call (Replace with real endpoint in prod)
      // const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
      
      // Simulating API latency and response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (credentials.email === 'fail@test.com') {
        throw new Error('Invalid credentials');
      }

      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-xyz-123',
        refreshToken: 'mock-refresh-token-abc-789',
        expiresIn: 3600,
        user: {
          id: 'u-123',
          name: 'Enterprise Admin',
          email: credentials.email,
          role: 'admin',
          organization: 'Global Corp Inc.',
          avatarUrl: 'https://ui-avatars.com/api/?name=Enterprise+Admin'
        }
      };

      // 3. Secure Storage
      this.saveSession(mockResponse);
      
      this.log('User logged in successfully', mockResponse.user.email);
      return mockResponse.user;
    });
  }

  public async logout(): Promise<void> {
    try {
      // Optional: Call server to invalidate token
      // await httpClient.post('/auth/logout', {});
    } catch (e) {
      console.warn('Logout API call failed, clearing local state anyway');
    } finally {
      this.clearSession();
    }
  }

  public getCurrentUser(): UserProfile | null {
    return secureStorage.getItem<UserProfile>('user_profile');
  }

  public isAuthenticated(): boolean {
    return !!secureStorage.getItem('auth_token');
  }

  private saveSession(session: AuthResponse) {
    secureStorage.setItem('auth_token', session.token);
    secureStorage.setItem('refresh_token', session.refreshToken);
    secureStorage.setItem('user_profile', session.user);
    secureStorage.setItem('token_expiry', Date.now() + session.expiresIn * 1000);
  }

  private clearSession() {
    secureStorage.clear();
  }
}

export const authService = new AuthService();
