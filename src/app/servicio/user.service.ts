import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid'; // Importamos la función para generar UUID

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  users = signal<User[]>([]); // Signal para manejar la lista de usuarios

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  //Cargar Usuarios
  loadUsers() {
    this.http
      .get<User[]>(this.apiUrl)
      .subscribe((users) => this.users.set(users));
  }

  // Agregar Usuario con UUID
  addUser(user: User) {
    const newUser: User = { ...user, id: uuidv4() }; // Generamos un UUID

    this.http.post<User>(this.apiUrl, newUser).subscribe((addedUser) => {
      this.users.set([...this.users(), addedUser]);
    });
  }

  //Actualizar usuario con UUID
  updateUser(user: User) {
    this.http
      .put<User>(`${this.apiUrl}/${user.id}`, user)
      .subscribe((updatedUser) => {
        this.users.set(
          this.users().map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
      });
  }

  // Borrar usuarios
  deleteUser(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.users.set(this.users().filter((u) => u.id !== id));
    });
  }
}
