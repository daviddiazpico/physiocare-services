import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from 'src/patient/patient.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { PhysioService } from 'src/physio/physio.service';
import { Record } from 'src/record/entities/record.entity';
import { RecordService } from 'src/record/record.service';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly physioService: PhysioService,
    private readonly patientService: PatientService,
    private readonly recordService: RecordService,
  ) {}

  private async checkIfAppointmentExists(id: number): Promise<Appointment> {
    const record = await this.appointmentsRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException('Appointment not found');
    }
    return record;
  }

  async findAppointmentsByPhysio(physio: Physio): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findBy({ physio });
    if (appointments.length === 0) {
      throw new NotFoundException(
        'This physio does not have any appointment associated',
      );
    }
    return appointments;
  }

  async findAppointmentsByRecord(record: Record): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findBy({ record });
    if (appointments.length === 0) {
      throw new NotFoundException(
        'This record does not have any appointment associated',
      );
    }
    return appointments;
  }

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

  async delete(id: number): Promise<void> {
    await this.checkIfAppointmentExists(id);
    await this.appointmentsRepository.delete(id);
  }
}
