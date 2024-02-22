import * as yup from 'yup';
import fs from 'fs/promises';
import Companies from '../models/Companies';
class CompaniesController {
  async store(request, response) {
    try {
      const schema = yup.object().shape({
        name_companies: yup.string().required(),
        branch_of_activity: yup.string().required(),
        email: yup.string().required(),
        company_description: yup.string().required(),
        password: yup.string().required().min(6),
      });
  
      try {
        await schema.validate(request.body, { abortEarly: false });
      } catch (err) {
        return response.status(400).json({ error: err.errors });
      }
    
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

      if (companiesExists) {
        return response.status(400).json({ error: 'Empresa já cadastrada!' });
      }

      // Utilize os links do Google Drive após o upload
      const companies = await Companies.create({
        name_companies,
        branch_of_activity,
        email,
        company_description,
        password,
        path_banner: request.path_banner, // Utilize os links fornecidos pelo middleware de upload
        path_img: request.path_img,
        path_companies_img: [
          request.first_img,
          request.second_img,
          request.third_img,
          request.fourth_img,
        ],
      });

      return response.json(companies);
    } catch (error) {
      console.error('Erro no método store do CompaniesController:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async index(request, response) {
    const companies = await Companies.findAll();
    return response.json(companies);
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
      await schema.validate(request.body, { abortEarly: false });
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

    let newPathBanner = companyExists.path_banner;
    let newPathImg = companyExists.path_img;

    // Se os arquivos estiverem disponíveis no `request.files`, então atualize os caminhos da imagem
    if (request.files && request.files.path_banner && request.files.path_img) {
      newPathBanner = (await uploadImageToDrive(request.files.path_banner[0].path, request.files.path_banner[0].filename, 'image/jpeg', process.env.GOOGLE_API_FOLDER_ID)).data.webViewLink;
      newPathImg = (await uploadImageToDrive(request.files.path_img[0].path, request.files.path_img[0].filename, 'image/jpeg', process.env.GOOGLE_API_FOLDER_ID)).data.webViewLink;

      // Exclui os arquivos temporários após o upload
      await Promise.all([
        fs.unlink(request.files.path_banner[0].path),
        fs.unlink(request.files.path_img[0].path),
      ]);
    }

    const { name_companies, branch_of_activity, company_description, password } = request.body;

    const updateCompanies = await Companies.update(
      {
        name_companies,
        branch_of_activity,
        company_description,
        path_banner: newPathBanner,
        path_img: newPathImg,
        password,
      },
      {
        where: { email },
      }
    );

    return response.status(201).json(updateCompanies);
  }
}



export default new CompaniesController();