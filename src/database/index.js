import Sequelize from 'sequelize'

import configDatabase from '../config/database'
import Companies from '../app/models/Companies'
import Vacancies from '../app/models/Vacancies'
import Comments from '../app/models/Comments'

const models = [Companies, Vacancies, Comments]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(configDatabase)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      )
  }
}

export default new Database()
