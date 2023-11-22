import * as yup from 'yup'
import Vacancies from '../models/Vacancies'
import Companies from '../models/Companies'

class VacanciesController {
    async store(request, response){
        const schema = yup.object().shape({
            vacancies_id: yup.number().required(),
            name_vacancies: yup.string().required(),
            number_of_vacancies: yup.string().required(),
            job_description: yup.string().required(),
            vacancy_requirements: yup.string().required(),
            additional_information: yup.string().required()
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
          } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const {
            vacancies_id,
            name_vacancies,
            number_of_vacancies,
            job_description,
            vacancy_requirements,
            additional_information
        } = request.body


        const newVacancies = Vacancies.create({
            name_vacancies,
            number_of_vacancies,
            job_description,
            vacancy_requirements,
            additional_information,
            vacancies_id
        })

        return response.status(201).json(newVacancies)
      
    }

    async index(request, response){
        const listVacancies = await Vacancies.findAll({
            include: {
                model: Companies, 
                as: 'vacancies' 
              },
        })
        return response.status(201).json(listVacancies)
    }

    async update(response, request){
        const schema = yup.object().shape({
            name_vacancies: yup.string(),
            number_of_vacancies: yup.string(),
            job_description: yup.string(),
            vacancy_requirements: yup.string(),
            additional_information: yup.string()
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
          } catch (err) {
            return response.status(400).json({ error: err.errors })
        }


        const { vacancies_id } = request.params

        const cacanciesExists = await Vacancies.findOne({
            where: { vacancies_id },
        })

        if (!cacanciesExists) {
            return response.status(400).json({ error: 'Vaga Não Encontrada' })
        }

        const {
            name_vacancies,
            number_of_vacancies,
            job_description,
            vacancy_requirements,
            additional_information
        } = request.body


        await Vacancies.update(
            {
                name_vacancies,
                number_of_vacancies,
                job_description,
                vacancy_requirements,
                additional_information
            },
            { where: { vacancies_id } }
        )

        return response.json({ message: 'status was update sucessfully' })
    }

    async delete(response, request){
        const { vacancies_id } = request.params

        const userExists = await Vacancies.findOne({
            where: { vacancies_id },
        })

        if (!userExists) {
            return response.status(400).json({ error: 'Vaga Não Encontrada' })
        }

        await Vacancies.destroy({
            where: { vacancies_id },
        });
    }
}



export default new VacanciesController()