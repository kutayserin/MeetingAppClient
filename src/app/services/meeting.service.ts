import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:5139/api/meetings';

  constructor(private http: HttpClient) { }

  getMeetings() {
    return this.http.get(this.apiUrl);
  }

  getMeeting(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createMeeting(meeting: any) {
    return this.http.post(this.apiUrl, meeting);
  }

  updateMeeting(id: number, meeting: any) {
    return this.http.put(`${this.apiUrl}/edit/${id}`, meeting);
  }

  deleteMeeting(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  downloadDocument(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }
}
