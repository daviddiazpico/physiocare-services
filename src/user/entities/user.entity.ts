import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from '../dto/user.dto';

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

  static fromDto(userDto: UserDto): User {
    const user = new User();
    user.username = userDto.username;
    user.password = userDto.password;
    user.rol = userDto.rol;
    user.firebaseToken = userDto.firebaseToken ?? '';
    return user;
  }
}
