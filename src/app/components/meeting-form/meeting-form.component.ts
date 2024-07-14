import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetingService } from '../../services/meeting.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.css']
})
export class MeetingFormComponent {
  meetingForm: FormGroup;
  meetingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.meetingForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
      document: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.meetingId = +id;
        this.meetingService.getMeeting(this.meetingId).subscribe(
          data => this.meetingForm.patchValue(data),
          error => console.error(error)
        );
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.meetingForm.patchValue({ document: file });
  }

  saveMeeting() {
    const formData = new FormData();
    Object.keys(this.meetingForm.value).forEach(key => {
      formData.append(key, this.meetingForm.value[key]);
    });

    if (this.meetingId) {
      this.meetingService.updateMeeting(this.meetingId, formData).subscribe(
        () => this.router.navigate(['/meetings']),
        error => console.error(error)
      );
    } else {
      this.meetingService.createMeeting(formData).subscribe(
        () => this.router.navigate(['/meetings']),
        error => console.error(error)
      );
    }
  }
}