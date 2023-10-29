import multer from 'multer'
import multerConfig from './config/multer'

import { Router } from 'express'
import CompaniesController from './app/controlles/CompaniesController'
import VacanciesController from './app/controlles/VacanciesController'
import SessionsController from './app/controlles/SessionController'
import SendMail from './app/controlles/SendMail'

const upload = multer(multerConfig)

const routes = new Router()

routes.post('/sendMail', SendMail.store )
routes.post('/companies', upload.fields([{ name: 'path_banner' }, { name: 'path_img' }]), CompaniesController.store)
routes.get('/listCompanies', CompaniesController.index)
routes.put('/updateCompanies', CompaniesController.update)

routes.post('/sessions', SessionsController.store)

routes.post('/vacancies', VacanciesController.store)
routes.get('/listVacancies', VacanciesController.index)
routes.put('/updateVacancies', VacanciesController.update)
routes.delete('/deleteVacancies', VacanciesController.delete)

export default routes