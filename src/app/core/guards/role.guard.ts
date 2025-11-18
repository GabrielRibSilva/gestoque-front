import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PerfilUsuario } from '../models/auth.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userPerfil = authService.getPerfilUsuario();
  
  const expectedRole = route.data['role'] as PerfilUsuario;

  if (!authService.isLoggedIn() || !userPerfil) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRole && userPerfil !== expectedRole) {
    console.warn(`Acesso negado. Requer perfil ${expectedRole}, mas usuário é ${userPerfil}.`);
    
    router.navigate(['/dashboard']); 
    return false;
  }

  return true;
};