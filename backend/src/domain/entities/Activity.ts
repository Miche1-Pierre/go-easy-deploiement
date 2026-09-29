import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Booking } from "./Booking";

@Entity("activities")
export class Activity {
  @PrimaryGeneratedColumn() id!: number;
  @Column() title!: string;
  @Column({ type: "text" }) description!: string;
  @Column() city!: string;
  @Column() category!: string;
  @Column() meetingPoint!: string;
  @Column({ type: "datetime" }) startDate!: Date;
  @Column({ type: "int" }) durationMinutes!: number;
  @Column({ type: "decimal", precision: 10, scale: 2 }) pricePerPerson!: number;
  @Column({ type: "int" }) capacity!: number;
  @Column({ default: "" }) imageUrl!: string;
  @OneToMany(() => Booking, (booking) => booking.activity) bookings!: Booking[];
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
