import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhysioService } from 'src/physio/physio.service';
import { RecordService } from 'src/record/record.service';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly physioService: PhysioService,
    private readonly patientService: PatientService,
    private readonly recordService: RecordService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const physio = await this.physioService.findOne(
      createAppointmentDto.physioId,
    );
    const patient = await this.patientService.findOne(
      createAppointmentDto.patientId,
    );

    const appointment =
      this.appointmentsRepository.create(createAppointmentDto);
    appointment.physio = physio;
    appointment.patient = patient;

    return await this.appointmentsRepository.save(appointment);
  }

  async confirmAppointment(id: number): Promise<void> {
    const appointment = await this.appointmentsRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const patientRecord = await this.recordService.findOne(
      appointment.patient.id,
    );

    appointment.record = patientRecord;
    appointment.confirmed = true;

    await this.appointmentsRepository.save(appointment);
  }
}
