import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class Companies extends Model{
    static init(sequelize){
      super.init(
          {
            name_companies: Sequelize.STRING,
            email: Sequelize.STRING,
            company_description: Sequelize.TEXT,
            branch_of_activity: Sequelize.STRING, 
            path_banner: Sequelize.STRING,
            path_img: Sequelize.STRING,
            path_companies_img: Sequelize.JSON,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
          },
          {
              sequelize,
          }
        )

        this.addHook('beforeSave', async (user) => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 10)
          }
        })

        return this
    }

    checkPassword(password) {
      return bcrypt.compare(password, this.password_hash)
    }

    static associate(models){
      this.belongsTo(models.Comments, {
          foreignKey: 'id',
          as: 'comments'
      })
  }
} 

export default Companies