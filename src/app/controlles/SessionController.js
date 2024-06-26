import * as yup from 'yup'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import Companies from '../models/Companies'

class SessionsController {
  async store(request, response) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    })

    const cnpjPasswordIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'Make sure your cnpj or email are correct' })
    }

    if (!(await schema.isValid(request.body))) {
      return cnpjPasswordIncorrect()
    }

    const { email, password } = request.body

    const companies = await Companies.findOne({
      where: { email },
    })

    if (!companies) {
      return cnpjPasswordIncorrect()
    }

    if (!(await companies.checkPassword(password))) {
      return cnpjPasswordIncorrect()
    }

    return response.json({
      id: companies.id,
      company_description: companies.company_description,
      email,
      name_companies: companies.name_companies,
      path_img: companies.path_img,
      path_banner: companies.path_banner,
      urlImage: companies.urlImage,
      urlBanner: companies.urlBanner,
      token: jwt.sign({ id: companies.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionsController()
