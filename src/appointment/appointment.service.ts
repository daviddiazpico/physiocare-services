import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Patient } from 'src/patient/entities/patient.entity';
import { PhysioService } from 'src/physio/physio.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly physioService: PhysioService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    patient: Patient,
  ): Promise<Appointment> {
    const physio = await this.physioService.findOne(
      createAppointmentDto.physioId,
    );

    const appointment = this.appointmentsRepository.create(createAppointmentDto);
    appointment.physio = physio;
    appointment.patient = patient;

    return await this.appointmentsRepository.save(appointment);
  }
}
