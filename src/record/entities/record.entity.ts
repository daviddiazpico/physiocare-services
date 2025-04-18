import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'records' })
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000, default: '' })
  medicalRecord: string;

  @OneToOne(() => Patient, { nullable: false })
  @JoinColumn()
  patient: Patient;

  @OneToMany(() => Appointment, (appointment) => appointment.record, {
    nullable: true,
    lazy: true,
  })
  appointments: Promise<Appointment[]>;
}
