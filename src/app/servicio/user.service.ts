import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  users = signal<User[]>([]);

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  //Cargar Usuarios
  loadUsers() {
    this.http
      .get<User[]>(this.apiUrl)
      .subscribe((users) => this.users.set(users));
  }

  // Agregar Usuario
  addUsers(user: User) {
    this.http.post<User>(this.apiUrl, user).subscribe((newUser) => {
      this.users.set([...this.users(), newUser]);
    });
  }

  //Actualizar usuario
  updataUser(user: User) {
    this.http
      .put<User>(`${this.apiUrl}/${user.id}`, user)
      .subscribe((updatadUser) => {
        this.users.set(
          this.users().map((u) => (u.id === updatadUser.id ? updatadUser : u))
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
