import { Patient } from 'src/patient/entities/patient.entity';
import { Physio } from 'src/physio/entities/physio.entity';
import { Record } from 'src/record/entities/record.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 500, default: '' })
  diagnosis: string;

  @Column({ type: 'varchar', length: 150, default: '' })
  treatment: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  observations: string;

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    nullable: false,
    eager: true,
  })
  patient: Patient;

  @ManyToOne(() => Physio, (physio) => physio.appointments, {
    nullable: false,
    eager: true,
  })
  physio: Physio;

  @ManyToOne(() => Record, (record) => record, { nullable: true })
  record: Record;
}
