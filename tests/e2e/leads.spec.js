import { test, expect } from '../support'

const { faker } = require('@faker-js/faker')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM leads`)
})

test('Should register a lead in the waiting queue', async ({ page }) => {
    const leadName = faker.person.fullName()
    const leadEmail = faker.internet.email()

    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm(leadName, leadEmail)

    const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
    await page.popup.haveText(message)
});

test('Should not register a lead with a registered email', async ({ page, request }) => {
    const leadName = faker.person.fullName()
    const leadEmail = faker.internet.email()

    const newLead = await request.post('http://localhost:3333/leads', {
        data: {
            name: leadName,
            email: leadEmail
        }
    })

    expect(newLead.ok()).toBeTruthy()

    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm(leadName, leadEmail)

    const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
    await page.popup.haveText(message)
});

test('Should not register a lead with an invalid email', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('Kamila Teste', 'testealimbr+1.com')

    await page.leads.alertHaveText('Email incorreto')
});

test('Should not register a lead when the name field is empty', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('', 'testealimbr+1@gmail.com')

    await page.leads.alertHaveText('Campo obrigatório')
});

test('Should not register a lead when the email field is empty', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('Kamila Teste', '')

    await page.leads.alertHaveText('Campo obrigatório')
});

test('Should not register a lead when the "Fila de Espera " form is empty', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('', '')

    await page.leads.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório'
    ])
});
