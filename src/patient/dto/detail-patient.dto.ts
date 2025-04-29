import { Appointment } from 'src/appointment/entities/appointment.entity';

export class DetailPatientDto {
  id: number;
  name: string;
  surname: string;
  birthdate: Date;
  address: string;
  insuranceNumber: string;
  email: string;
  avatar: string;
  lat: number;
  lng: number;
  appointments: Appointment[];
}
