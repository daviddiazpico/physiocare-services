import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';

export class DetailRecordDto {
  id: number;
  medicalRecord: string;
  patient: Patient;
  appointments: Appointment[];
}
