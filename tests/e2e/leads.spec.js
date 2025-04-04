import { test, expect } from '../support'

const { faker } = require('@faker-js/faker')

test('Should register a lead in the waiting queue', async ({ page }) => {
    const leadName = faker.person.fullName()
    const leadEmail = faker.internet.email()

    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm(leadName, leadEmail)

    const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
    await page.toast.containText(message)
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

    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm(leadName, leadEmail)

    const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
    await page.toast.containText(message)
});

test('Should not register a lead with an invalid email', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('Kamila Teste', 'testealimbr+1.com')

    await page.landing.alertHaveText('Email incorreto')
});

test('Should not register a lead when the name field is empty', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('', 'testealimbr+1@gmail.com')

    await page.landing.alertHaveText('Campo obrigatório')
});

test('Should not register a lead when the email field is empty', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('Kamila Teste', '')

    await page.landing.alertHaveText('Campo obrigatório')
});

test('Should not register a lead when the "Fila de Espera " form is empty', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('', '')

    await page.landing.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório'
    ])
});
