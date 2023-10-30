import Sequelize, { Model } from 'sequelize'

class Vacancies extends Model {
    static init(sequelize){
        super.init({
            coupons_id: Sequelize.INTEGER,
            name_coupons: Sequelize.STRING,
            coupon_discount: Sequelize.STRING,
            participating_product: Sequelize.STRING,
            requirements: Sequelize.STRING,
            expiry_date: Sequelize.STRING,
            coupon_img: Sequelize.STRING,
            urlImgCoupon: {
                type: Sequelize.VIRTUAL,
                get() {
                  return `https://api-realize.vercel.app/companies-file/${this.coupon_img}`;
                },
            },
        },
        {
            sequelize
        }
        )
        return this
    }

    static associate(models){
        this.belongsTo(models.Companies, {
            foreignKey: 'coupons_id',
            as: 'coupons'
        })
    }
}

export default Vacancies