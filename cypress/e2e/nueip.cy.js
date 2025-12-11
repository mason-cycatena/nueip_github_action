describe('Nueip', () => {
    let hasFailure = false;
    beforeEach(function () {
        if (hasFailure) {
            this.skip();
        }
    });
    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            hasFailure = true;
            cy.log('發生錯誤，準備略過剩餘測試以保留報告...');
        }
    })
    it('Nueip homepage', () => {
        cy.visit('https://cloud.nueip.com/login')
    })

    it('Nueip inputCompany', () => {
        cy.get('[name=inputCompany]', { timeout: 30000 }).should('be.visible').type(Cypress.env("COMPANY"))
    })

    it('Nueip inputID', () => {
        cy.get('[name=inputID]', { timeout: 30000 }).should('be.visible').type(Cypress.env('USER'))
    })

    it('Nueip password', () => {
        cy.get('[name=inputPassword]', { timeout: 30000 }).should('be.visible').type(Cypress.env('PASSWORD'))
    })

    it('Nueip clickLogin', () => {
        cy.get('.login-button', { timeout: 30000 }).should('be.visible').click()
    })

    it('Nueip logined', () => {
        cy.get('button.el-button.el-button--primary.por-button.punch-button', { timeout: 30000 }).should('be.visible')
    })
    it('Nueip to cloud.nueip.com/home', () => {
        cy.visit("https://cloud.nueip.com/home")
        cy.get('input[name="token"]', { timeout: 30000 }).should('exist').then(($input) => {
            const token = $input.val()
            cy.log('Logined token:', token)
            Cypress.env('apiToken', token)
        })
    })

    it('Nueip getTokenAPI', () => {
        cy.request({
            method: 'GET',
            url: 'https://cloud.nueip.com/oauth2/token/api',
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.log('Token Access Token:', response.body.token_access_token)
            Cypress.env('authToken', response.body.token_access_token)
        })
    })

    it('Nueip punch-in', () => {
        cy.request({
            method: 'POST',
            url: 'https://cloud.nueip.com/portal/Portal_punch_clock/ajax',
            header: {
                'authorization': 'Bearer ' + Cypress.env('authToken'),
                "content-type": "multipart/form-data",
                'x-requested-with': 'XMLHttpRequest',
            },
            form: true,
            body: {
                check_type: '1',
                id: Cypress.env('INON'), // 1 punch-in, 2 punch-out
                token: Cypress.env('apiToken'),
                attendance_time: toTaiwanTime(new Date()),
                lat: Cypress.env('LAT') || '25.033360508978323',
                lng: Cypress.env('LNG') || '121.51708965192844'
            }
        }).then((response) => {
            // 驗證 API 是否成功
            expect(response.status).to.eq(200)
            cy.log('Punch In Clock Response:', response.body)
        })
    })

    it('Nueip reload', () => {
        cy.reload()
    })
})


const toTaiwanTime = (date) => {
    // 取得當地時間偏移量 (台灣是 -480 分鐘)
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);

    // 轉成 ISO 格式 (YYYY-MM-DDTHH:mm:ss.sssZ) 並切掉尾巴
    return localDate.toISOString().replace('T', ' ').slice(0, 19);
}
