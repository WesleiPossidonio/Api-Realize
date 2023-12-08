
import { Router } from 'express'
import CompaniesController from './app/controlles/CompaniesController'
import VacanciesController from './app/controlles/VacanciesController'
import SessionsController from './app/controlles/SessionController'
import SendMail from './app/controlles/SendMail'
import CouponController from './app/controlles/CouponController'
import {upload, uploadToFirebase } from './config/multer'

const routes = new Router()

routes.post('/sendMail', SendMail.store )
routes.post('/companies', upload.fields([{ name: 'path_banner' }, { name: 'path_img' }]), uploadToFirebase, CompaniesController.store)
routes.get('/listCompanies', CompaniesController.index)
routes.put('/updateCompanies', CompaniesController.update)

routes.post('/sessions', SessionsController.store)

routes.post('/vacancies', VacanciesController.store)
routes.get('/listVacancies', VacanciesController.index)
routes.put('/updateVacancies', VacanciesController.update)
routes.delete('/deleteVacancies', VacanciesController.delete)

routes.post('/coupon', upload.single('coupon_img'), CouponController.store)
routes.get('/listCoupon', CouponController.index)
routes.put('/updateCoupon', CouponController.update)
routes.delete('/deleteCoupon', CouponController.delete)


export default routes