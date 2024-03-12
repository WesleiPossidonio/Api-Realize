import Sequelize, { Model } from 'sequelize'

class Comments extends Model {
    static init(sequelize){
        super.init({
            comments_id: Sequelize.INTEGER,
            name_user: Sequelize.STRING,
            text_comments: Sequelize.TEXT,
            number_of_stars: Sequelize.INTEGER,
        },
        {
            sequelize
        }
        )
        return this
    }

    static associate(models){
        this.belongsTo(models.Companies, {
            foreignKey: 'comments_id',
            as: 'vacancies'
        })
    }
}

export default Comments