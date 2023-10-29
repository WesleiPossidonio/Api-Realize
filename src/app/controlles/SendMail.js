import * as yup from 'yup'
import nodemailer from 'nodemailer'
import mjml2html from 'mjml'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {

    }
})

class SendEmail {
    async store(request, response) {
        const schema = yup.object().shape({
            name: yup.string().required(),
            coverLatter: yup.string().required(),
            email: yup.string().email().required(),
            emailCompany: yup.string().email().required(),
            phone: yup.string().required(),
            pdf: yup.string().required().test('is-pdf', 'O arquivo deve ter a extensão .pdf', (value) => {
                return value.toLowerCase().endsWith('.pdf');
            })
        })

        const { name , email , coverLatter , phone, emailCompany } = request.body

        const { filename: pdf } = request.file

        try {
            await schema.validate({ name, email, coverLetter, phone, pdf });
        } catch (error) {
            return response.status(400).json({ error: 'Dados do formulário inválidos.' });
        }


        const mjmlCode = `
            <mjml version="3.3.3">
                <mj-body background-color="#F4F4F4" color="#55575d" font-family="Arial, sans-serif">
                <mj-section background-color="#020202" background-repeat="repeat" padding="20px 0" text-align="center" vertical-align="top">
                    <mj-column>
                        <mj-image align="center" padding="10px 25px" src="" width="128px"></mj-image>
                    </mj-column>
                </mj-section>
  
                <mj-section background-color="#000" background-repeat="repeat" background-size="auto" padding="0px 0px 20px 0px" text-align="center" vertical-align="top">
                    <mj-column>
                        <mj-text>
                            <h2 margin-botton="1rem" class="Title-list">Nome: ${name}</h2>
                            <h2 margin-botton="1rem" class="Title-list">Telefone: ${phone}</h2>
                        </mj-text>

                        <mj-text>
                            <p margin-botton="1rem" class="Title-list">${coverLatter}</p>
                        </mj-text>
  
                    </mj-column>
                </mj-section>
                <mj-section background-color="#020202" background-repeat="repeat" padding="20px 0" text-align="center" vertical-align="top">
                    <mj-column>
                        <mj-text align="center" color="#ffffff" font-family="Arial, sans-serif" font-size="13px" line-height="22px">
                        <p color="#FFF"><strong>Rua Pereira de Souza, nº 104 - Centro, Macaé, RJ CEP:27.913-110</strong></p>
                        <p color="#FFF"><strong>Tel: (22) 2106-1902  WhatsApp: (22) 99979.6222</strong></p>
                        <p color="#FFF"><strong>E-mail: rtd-pj@macae1oficio.com.br</p>
                    </mj-text>
                </mj-column>
            </mj-section>
  
            <mj-section background-repeat="repeat" background-size="auto" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
                <mj-column>
                    <mj-text align="center" color="#55575d" font-family="Arial, sans-serif" font-size="11px" line-height="22px" padding="0px 20px"></mj-text>
                </mj-column>
            </mj-section>
        </mj-body>
    </mjml>
    `

        let html
        try {
            const { html: convertedHtml } = mjml2html(mjmlCode)
            html = convertedHtml
        } catch (error) {
            console.error('Erro ao converter o MJML em HTML:', error)
            return response.status(500).json({ error: 'Erro interno do servidor' })
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Atualização de Senha',
            html,
            attachments: [ 
            {   
                filename: pdf
            }
        ]
        }

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email enviado com sucesso!');
            return response.status(200).json({ success: 'E-mail enviado com sucesso.' });
        } catch (error) {
            console.error('Erro ao enviar o e-mail:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }


    }
}

export default new SendEmail()