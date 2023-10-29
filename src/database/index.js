import Sequelize from 'sequelize'

import configDatabase from '../config/database'
import Companies from '../app/models/Companies'
import Vacancies from '../app/models/Vacancies'



const models = [Companies, Vacancies]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(configDatabase)
    models.map((model) => model.init(this.connection)).map(
      (model) => model.associate && model.associate(this.connection.models)
    )
  }
}

export default new Database()