import { Appointment } from 'src/appointment/entities/appointment.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  surname: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 9, unique: true })
  insuranceNumber: string;

  @Column({ type: 'varchar', length: 75, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatar: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    nullable: false,
  })
  appointments: Appointment[];
}
