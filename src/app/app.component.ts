import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from './servicio/user.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'csig';
  // uuidv4();
  name = signal('');
  email = signal('');
  editingUser = signal<User | null>(null);

  constructor(public userService: UserService) {}

  // Agregar Usuario
  // addUser() {
  //   if (this.name() && this.email()) {
  //     this.userService.addUsers({
  //       id: uuidv4(),
  //       name: this.name(),
  //       email: this.email(),
  //     });
  //     this.name.set('');
  //     this.email.set('');
  //   }
  // }

  addOrUpdateUser() {
    if (this.editingUser()) {
      // Actulizar Usuario
      const updatedUser: User = {
        id: this.editingUser()!.id,
        name: this.name(),
        email: this.email(),
      };
      this.userService.updateUser(updatedUser);
      // this.cancelEdit();
    } else {
      // Agregar nuevo usuario
      this.userService.addUser({
        name: this.name(),
        email: this.email(),
      });
    }
    this.name.set('');
    this.email.set('');
  }

  editUser(user: User) {
    this.editingUser.set(user);
    this.name.set(user.name);
    this.email.set(user.email);
  }

  // Borrar Usuario
  deleteUser(id: string) {
    this.userService.deleteUser(id);
  }

  cancelEdit() {
    this.editingUser.set(null);
    this.name.set('');
    this.email.set('');
  }
}
