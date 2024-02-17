import * as yup from 'yup'
import Companies from '../models/Companies'
class CompaniesController {
    async store(request, response) {
        const schema = yup.object().shape({
          name_companies: yup.string().required(),
          branch_of_activity: yup.string().required(),
          email: yup.string().required(),
          company_description: yup.string().required(),
          password: yup.string().required().min(6),
        });
      
        try {
          await schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
          return response.status(400).json({ error: err.errors });
        }
      
        const { 
          path_banner,  
          path_img,
          path_companies_img
        } = request;

        const {
          name_companies,
          branch_of_activity,
          email,
          company_description,
          password,
        } = request.body;
      
        const companiesExists = await Companies.findOne({
          where: { email },
        });
      
        if ( !path_banner || !path_img || !path_companies_img ||  (!path_banner && !path_img && !path_companies_img)) {
          return response.status(400).json({ error: 'Imagens Não Encontradas' });
        }
      
        if (companiesExists) {
          return response.status(400).json({ error: 'Empresa Já Cadastrada!' });
        }
      
        const companiesEmailExists = await Companies.findOne({
          where: { email },
        });
      
        if (companiesEmailExists) {
          return response.status(400).json({ error: 'Email Já Cadastrado!' });
        }
      
        const companies = await Companies.create({
          name_companies,
          branch_of_activity,
          email,
          company_description,
          password,
          path_banner,
          path_img,
          path_companies_img: path_companies_img.map(img => img.url)
        });
      
        return response.json(companies);
      }

    async index(request, response){
        const companies = await Companies.findAll()
        return response.json(companies)
    }

    async update(request, response) {
      const schema = yup.object().shape({
          name_companies: yup.string(),
          branch_of_activity: yup.string(),
          email: yup.string(),
          company_description: yup.string(),
          path_banner: yup.string(),
          path_img: yup.string(),
          password: yup.string().min(6),
      });
  
      try {
          await schema.validateSync(request.body, { abortEarly: false });
      } catch (err) {
          return response.status(400).json({ error: err.errors });
      }
  
      const { email } = request.params;
  
      const companyExists = await Companies.findOne({
          where: { email },
      });
  
      if (!companyExists) {
          return response.status(404).json({ error: 'Empresa não encontrada.' });
      }
  
      // Se os arquivos estiverem disponíveis no `request.files`, então atualize os caminhos da imagem
      let newPath_banner = companyExists.path_banner;
      let newPath_img = companyExists.path_img;
  
      if (request.files && request.files.path_banner && request.files.path_img) {
          newPath_banner = request.files.path_banner[0].filename;
          newPath_img = request.files.path_img[0].filename;
      }
  
      const {
          name_companies,
          branch_of_activity,
          company_description,
          password,
      } = request.body;
  
      const updateCompanies = await Companies.update(
          {
              name_companies,
              branch_of_activity,
              company_description,
              path_banner: newPath_banner,
              path_img: newPath_img,
              password,
          },
          {
              where: { email },
          }
      );
  
      return response.status(201).json(updateCompanies);
  }

}

export default new CompaniesController()