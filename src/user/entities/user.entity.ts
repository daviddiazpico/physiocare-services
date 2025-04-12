import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 75, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'physio', 'patient'] })
  rol: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  firebaseToken: string;
}
