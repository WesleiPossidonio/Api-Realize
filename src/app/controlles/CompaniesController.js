import * as yup from 'yup'
import Companies from '../models/Companies'
import Vacancies from '../models/Vacancies'



class CompaniesController {
    async store(request, response){
        const schema = yup.object().shape({
            name_companies: yup.string().required(),
            cnpj: yup.string().required(),
            email: yup.string().required(),
            company_description: yup.string().required(),
            password: yup.string().required().min(6),
           
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
          } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const { path_banner, path_img } = request.files
        const { 
            name_companies, 
            cnpj, 
            email, 
            company_description, 
            password 
        } = request.body

        const companiesExists = await Companies.findOne({
            where: { cnpj },
        })

        if(!path_banner || !path_img || !path_banner && !path_img){
            return response.status(400).json({ error: 'Imagens Não emcontradas' })
        }
      
        if (companiesExists) {
            return response.status(400).json({ error: 'Empresa Já Cadastrada!' })
        }

        const companiesEmailExists = await Companies.findOne({
            where: { email },
        })

        if (companiesEmailExists) {
            return response.status(400).json({ error: 'Email Já Cadastrado!' })
        }

        const companies = await Companies.create({
            name_companies,
            cnpj,
            email,
            company_description,
            password,
            path_banner: path_banner[0].filename, 
            path_img: path_img[0].filename, 
        })

        return response.json(companies)
    }

    async index(request, response){
        const companies = await Companies.findAll()
        return response.json(companies)
    }

    async update(request, response){
        const schema = yup.object().shape({
            name_companies: yup.string(),
            cnpj: yup.string(),
            email: yup.string(),
            company_description: yup.string(),
            path_banner: yup.string(),
            path_img: yup.string(),
            password: Yup.string().min(6),
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
          } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const { cnpj } = request.params

        const companyExists = await Companies.findOne({
            where: { cnpj },
          })
      
          if (companyExists) {

            const { path_banner, path_img } = request.files
            const {
                name_companies,
                cnpj,
                email,
                company_description,
                password,
            } = request.body;

            const newPath_banner = path_banner[0].filename
            const newPath_img = path_img[0].filename

            const updateCompanies = await Companies.update(
                {
                  name_companies,
                  email,
                  company_description,
                  path_banne: newPath_banner,
                  path_img: newPath_img,
                  password,
                },
                {
                  where: { cnpj }, 
                }
            );

            return response.status(201).json(updateCompanies)
        } else {
            return response.status(404).json({ error: 'Empresa não encontrada.' });
        }

    }

    
    
}


export default new CompaniesController()