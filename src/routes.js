
import { Router } from 'express'
import CompaniesController from './app/controlles/CompaniesController'
import VacanciesController from './app/controlles/VacanciesController'
import SessionsController from './app/controlles/SessionController'
import SendMail from './app/controlles/SendMail'

import {upload, uploadToFirebase } from './config/multer'
import CommentsController from './app/controlles/CommentsController'

const routes = new Router()

routes.post('/sendMail', SendMail.store )
routes.post('/companies', upload.fields([{ name: 'path_banner' }, { name: 'path_img' }, { name: 'img_company_one' }, { name: 'img_company_two' }, { name: 'img_company_three' }, { name: 'img_company_four' }]), uploadToFirebase, CompaniesController.store)
routes.get('/listCompanies', CompaniesController.index)
routes.put('/updateCompanies', CompaniesController.update)

routes.post('/sessions', SessionsController.store)

routes.post('/vacancies', VacanciesController.store)
routes.get('/listVacancies', VacanciesController.index)
routes.put('/updateVacancies', VacanciesController.update)
routes.delete('/deleteVacancies', VacanciesController.delete)

routes.get('/listComments', CommentsController.index)
routes.post('/addComments', CommentsController.store)


export default routes