import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'physios' })
export class Physio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  surname: string;

  @Column({
    type: 'enum',
    enum: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological'],
  })
  specialty: string;

  @Column({ type: 'varchar', length: 8, unique: true })
  licenseNumber: string;

  @Column({ type: 'varchar', length: 75, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatar: string;

  @Column({ type: 'numeric', default: 0 })
  lat: number;

  @Column({ type: 'numeric', default: 0 })
  lng: number;

  @OneToMany(() => Appointment, (appointment) => appointment.physio, { nullable: false })
  appointments: Appointment[];
}
