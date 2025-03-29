import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid') // Use 'uuid' to auto-generate UUID
  id!: string // UUID is stored as a string

  @Column({ type: 'text' }) // Define text column type explicitly for SQLite
  name!: string

  @Column({ type: 'text', unique: true }) // Explicitly set as text for SQLite
  email!: string
}
