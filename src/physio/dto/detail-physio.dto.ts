import { Appointment } from 'src/appointment/entities/appointment.entity';

export class DetailPhysioDto {
  id: number;
  name: string;
  surname: string;
  specialty: string;
  licenseNumber: string;
  email: string;
  avatar: string;
  lat: number;
  lng: number;
  appointments: Appointment[];
}
