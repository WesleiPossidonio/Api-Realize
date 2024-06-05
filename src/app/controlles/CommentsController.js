import * as yup from 'yup'
import Comments from '../models/Comments'

class CommentsController {
  async store(request, response) {
    const schema = yup.object().shape({
      comments_id: yup.number().required(),
      name_user: yup.string().required(),
      text_comments: yup.string().required(),
      number_of_stars: yup.number().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { comments_id, name_user, text_comments, number_of_stars } =
      request.body

    const newComments = Comments.create({
      comments_id,
      name_user,
      text_comments,
      number_of_stars,
    })

    return response.status(201).json(newComments)
  }

  async index(request, response) {
    const listVacancies = await Comments.findAll()
    return response.status(201).json(listVacancies)
  }
}

export default new CommentsController()
