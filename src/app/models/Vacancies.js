import Sequelize, { Model } from 'sequelize'

class Vacancies extends Model {
    static init(sequelize){
        super.init({
            vacancies_id: Sequelize.INTEGER,
            name_vacancies: Sequelize.STRING,
            number_of_vacancies: Sequelize.STRING,
            job_description: Sequelize.STRING,
            vacancy_requirements: Sequelize.STRING,
            additional_information: Sequelize.STRING
        },
        {
            sequelize
        }
        )
        return this
    }

    static associate(models){
        this.belongsTo(models.Companies, {
            foreignKey: 'vacancies_id',
            as: 'vacancies'
        })
    }
}

export default Vacancies