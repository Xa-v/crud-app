import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Users } from '@/app/entities/user' // Import your entity files

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './src/app/lib/database.sqlite', // SQLite database file
  entities: [Users], // Add all your entities here
  synchronize: true, // Set to false in production
  logging: true, // Set to false in production
})
 
export const getDatabaseConnection = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  

  return AppDataSource
}
