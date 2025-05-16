import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from 'src/patient/patient.service';
import { PhysioService } from 'src/physio/physio.service';
import { RecordService } from 'src/record/record.service';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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
    const appointment = await this.appointmentsRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  findOne(id: number): Promise<Appointment> {
    return this.checkIfAppointmentExists(id);
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

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.checkIfAppointmentExists(id);

    for (const property in updateAppointmentDto) {
      if (property != 'id') {
        appointment[property] = updateAppointmentDto[property];
      }
    }

    return this.appointmentsRepository.save(appointment);
  }

  async confirmAppointment(id: number): Promise<void> {
    const appointment = await this.findOne(id);

    const patientRecord = await this.recordService.findOneByPatientId(
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
