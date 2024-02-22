
import { Router } from 'express'
import CompaniesController from './app/controlles/CompaniesController'
import VacanciesController from './app/controlles/VacanciesController'
import SessionsController from './app/controlles/SessionController'
import SendMail from './app/controlles/SendMail'
import CommentsController from './app/controlles/CommentsController'

import {upload, uploadToGoogleDrive} from './config/multer'


const routes = new Router()

routes.post('/sendMail', SendMail.store )
routes.post('/companies', upload.fields([
    {name: 'path_banner'},
    {name: 'path_img'}, 
    {name: 'first_img'}, 
    {name: 'second_img'},
    {name: 'third_img'},
    {name: 'fourth_img'}
  ]), uploadToGoogleDrive, CompaniesController.store);
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