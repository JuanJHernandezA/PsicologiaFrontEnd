export interface DecodedToken {
  id?: number;
  email?: string;
  name?: string;
  lastName?: string;
  role?: 'Estudiante' | 'Administrador' | 'Psicologo';
  iat?: number;
  exp?: number;
}

/**
 * Decodifica un JWT token sin verificar la firma
 * @param token 
 * @returns
 */

export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    const decoded = atob(base64);
    
    return JSON.parse(decoded) as DecodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Obtiene el rol del usuario desde el token
 @param token 
 @returns 
 */
export function getRoleFromToken(token: string): 'Estudiante' | 'Administrador' | 'Psicologo' | null {
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

/**
 * Verifica si el token ha expirado
 * @param token
 * @returns
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const expirationTime = decoded.exp * 1000;
  return Date.now() >= expirationTime;
}

