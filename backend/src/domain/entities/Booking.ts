import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "@domain/entities/User";
import { Activity } from "@domain/entities/Activity";
import { BookingStatus } from "./enums";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Activity, (activity) => activity.bookings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "activityId" })
  activity!: Activity;

  @Column()
  activityId!: number;

  @Column({ type: "int", default: 1 })
  participants!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status!: BookingStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
