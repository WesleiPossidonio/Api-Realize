import * as yup from 'yup'
import nodemailer from 'nodemailer'
import mjml2html from 'mjml'

const transporter = nodemailer.createTransport ({ 
    service : "Gmail" , 
    host : "smtp.gmail.com" , 
    port : 465, 
    secure : true, 
    auth : { 
      user : process.env.EMAIL, 
      pass : process.env.PASSWORD_EMAIL, 
    }, 
  }) ;

class SendEmail {
    async store(request, response) {
        const schema = yup.object().shape({
            name: yup.string().required(),
            subject: yup.string().required(),
            email: yup.string().email().required(),
            phone: yup.string().required(),
        })

        const { name , email , subject , phone } = request.body

        try {
            await schema.validateSync(request.body, { abortEarly: false })
        } catch (error) {
            return response.status(400).json({ error: 'Dados do formulário inválidos.' });
        }


        const mjmlCode = `
            <mjml version="3.3.3">
                <mj-body background-color="#fff" color="#55575d" font-family="Arial, sans-serif">
                 <mj-section background-color="#f2f2f2" background-repeat="repeat" padding="20px 0" text-align="center" vertical-align="top">
                    <mj-column>
                        <mj-image align="center" padding="10px 25px" src="" width="128px"></mj-image>
                    </mj-column>
                </mj-section>
  
                <mj-section background-color="#f2f2f2" background-repeat="repeat" background-size="auto" padding="0px 0px 20px 0px" text-align="center" vertical-align="top">
                    <mj-column>
                        <mj-text>
                            <h2 margin-botton="1rem" class="Title-list">Nome: ${name}</h2>
                            <h2 margin-botton="1rem" class="Title-list">Telefone: ${phone}</h2>
                        </mj-text>

                        <mj-text>
                            <p margin-botton="1rem" class="Title-list">${subject}</p>
                        </mj-text>
  
                    </mj-column>
                </mj-section>
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
            to: process.env.EMAIL,
            subject: subject,
            html,
            headers: {
                'X-Mailer': 'MeuApp',
                'Reply-To': email // Adicionando o e-mail do frontend como um cabeçalho de resposta
            }
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