import * as yup from 'yup'
import Vacancies from '../models/Vacancies'
import Coupon from '../models/Vacancies'

class CouponController {
    async store(request, response){
        const schema = yup.object().shape({
            coupons_id: yup.number().required(),
            name_coupons: yup.string().required(),
            coupon_discount: yup.string().required(),
            participating_product: yup.string().required(),
            requirements: yup.string().required(),
            expiry_date: yup.string().required()
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
          } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const { coupon_img } = request.files

        const {
            coupons_id,
            name_coupons,
            coupon_discount,
            participating_product,
            requirements,
            expiry_date
        } = request.body

        if(!coupon_img){
            return response.status(400).json({ error: 'Imagens Não emcontradas' })
        }
      


        const newVacancies = Vacancies.create({
            name_coupons,
            coupon_discount,
            participating_product,
            requirements,
            expiry_date,
            coupons_id,
            coupon_img: coupon_img[0].filename
        })

        return response.status(201).json(newVacancies)
      
    }

    async index(request, response){
        const listVacancies = await Vacancies.findAll()
        return response.status(201).json(listVacancies)
    }

    async update(response, request){
        const schema = yup.object().shape({
            name_coupons: yup.string(),
            coupon_discount: yup.string(),
            participating_product: yup.string(),
            requirements: yup.string(),
            expiry_date: yup.string()
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
          } catch (err) {
            return response.status(400).json({ error: err.errors })
        }


        const { coupons_id } = request.params

        const cuponExists = await Coupon.findOne({
            where: { coupons_id },
        })

        if (!cuponExists) {
            return response.status(400).json({ error: 'cupon Não Encontrado' })
        }

        const { coupon_img } = request.files

        const {
            name_coupons,
            coupon_discount,
            participating_product,
            requirements,
            expiry_date
        } = request.body


        await Coupon.update(
            {
                name_coupons,
                coupon_discount,
                participating_product,
                requirements,
                expiry_date,
                coupon_img: coupon_img[0].filename
            },
            { where: { coupons_id } }
        )

        return response.json({ message: 'status was update sucessfully' })
    }

    async delete(response, request){
        const { coupons_id } = request.params

        const userExists = await Coupon.findOne({
            where: { coupons_id },
        })

        if (!userExists) {
            return response.status(400).json({ error: 'Cupon Não Encontrado' })
        }

        await Coupon.destroy({
            where: { coupons_id },
        });
    }
}



export default new CouponController()