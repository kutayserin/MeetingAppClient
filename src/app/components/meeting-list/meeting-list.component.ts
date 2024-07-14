

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  meetings: any[] = [];
  editingMeetingId: number | null = null;
  editForm: FormGroup;

  constructor(
    private meetingService: MeetingService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
      document: [null]
    });
  }

  ngOnInit() {
    this.fetchMeetings();
  }

  fetchMeetings() {
    this.meetingService.getMeetings().subscribe(
      (data: any) => {
        this.meetings = data;
      },
      error => {
        console.error('Error fetching meetings:', error);
      }
    );
  }

  editMeeting(meeting: any) {

    this.editForm.patchValue({
      name: meeting.name,
      startDate: new Date(meeting.startDate).toISOString().substring(0, 10),
      endDate: new Date(meeting.endDate).toISOString().substring(0, 10),
      description: meeting.description,
      document: null 
    });

    this.editingMeetingId = meeting.id;
  }

  saveMeeting() {
    const id = this.editingMeetingId;
    if (!id) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editForm.value.name);
    formData.append('startDate', this.editForm.value.startDate);
    formData.append('endDate', this.editForm.value.endDate);
    formData.append('description', this.editForm.value.description);

    const documentFile = this.editForm.get('document')!.value;
    if (documentFile instanceof File) {
      formData.append('document', documentFile);
    }

    this.meetingService.updateMeeting(id, formData).subscribe(
      updatedMeeting => {
        console.log('Meeting updated successfully:', updatedMeeting);
        this.fetchMeetings();
        this.cancelEdit();
      },
      error => {
        console.error('Error updating meeting:', error);
      }
    );
  }

  cancelEdit() {
    this.editingMeetingId = null;
    this.editForm.reset();
  }

  deleteMeeting(id: number) {
    this.meetingService.deleteMeeting(id).subscribe(
      () => {
        this.meetings = this.meetings.filter(m => m.id !== id);
      },
      error => {
        console.error('Error deleting meeting:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      this.editForm.patchValue({ document: file });
    } else {
      this.editForm.patchValue({ document: null }); 
    }
  }
}
