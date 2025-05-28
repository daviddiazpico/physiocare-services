import { Appointment } from 'src/appointment/entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ type: 'varchar', length: 100 })
  avatar: string;

  @OneToMany(() => Appointment, (appointment) => appointment.physio, {
    nullable: false,
  })
  appointments: Promise<Appointment[]>;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: Promise<User>;
}
