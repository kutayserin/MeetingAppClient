import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      profileImage: [null]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.registerForm.patchValue({ profileImage: file });
  }

  register() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.keys(this.registerForm.value).forEach(key => {
        formData.append(key, this.registerForm.value[key]);
      });

      this.authService.register(formData).subscribe(
        () => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration error:', error);
        }
      );
    } else {
      console.error('Form validation failed');
    }
  }
}
