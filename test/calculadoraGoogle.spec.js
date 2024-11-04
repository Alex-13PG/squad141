const { remote } = require('webdriverio')
const divisaoMassa = require('../vendors/massaDivisão')
const fatorialMassa = require('../vendors/massaFatorial')

describe('Calculadora App - Operações Matemáticas', () => {
    let driver

    const caps = {
        "platformName": "Android",
        "appium:platformVersion": "9.0",
        "appium:deviceName": "emulator-5554",
        "appium:automationName": "UIAutomator2",
        "appium:appActivity": "com.android.calculator2.Calculator",
        "appium:newCommandTimeout": 240,
        "appium:ensureWebviewsHavePages": true,
        "appium:nativeWebScreenshot": true,
        "appium:connectHardwareKeyboard": true
    };

    before(async () => {
        driver = await remote({
            protocol: "http",
            hostname: "127.0.0.1",
            port: 4723,
            path: "/",
            capabilities: caps
        });
    });

    after(async () => {
        await driver.deleteSession()
    });

    async function clearCalculator() {
        const clearButton = await driver.$("accessibility id:clear")
        await clearButton.click()
    }

    it('Deve dividir 99 por 33', async () => {
        await clearCalculator()
        await (await driver.$("accessibility id:9")).click()
        await (await driver.$("accessibility id:9")).click()
        await (await driver.$("accessibility id:divide")).click()
        await (await driver.$("accessibility id:3")).click()
        await (await driver.$("accessibility id:3")).click()
        await (await driver.$("accessibility id:equals")).click()
        

        const result = await driver.$("id:com.google.android.calculator:id/result_final")
        const resultText = await result.getText()
        
        console.log(`Resultado da divisão 99 por 33: ${resultText.trim()}`)
        
        if (resultText.trim() !== '3') {
            throw new Error(`Resultado incorreto: esperado '3', mas obteve '${resultText.trim()}'`)
        }
    })
    

    it('Fatorial de 55', async () => {
        await clearCalculator()
        await (await driver.$("accessibility id:5"))
            .click()
        await (await driver.$("accessibility id:5"))
            .click()
        await (await driver.$("accessibility id:factorial"))
            .click()
        await (await driver.$("accessibility id:equals"))
            .click()
        
        const result = await driver.$("id:com.google.android.calculator:id/result_final")
        const resultText = await result.getText()

        console.log(`Resultado do fatorial de 55: ${resultText.trim()}`)
        
        const esperado = '1.26964033536E73'
        if (resultText.trim() !== esperado) {
            throw new Error(`Resultado incorreto: esperado '${esperado}', mas obteve '${resultText.trim()}'`)
        }
    })
    
    divisaoMassa.array.forEach(({ num1, num2, num3, num4, esperado }) => {
        it(`dividir ${num1}${num2} por ${num3}${num4}`, async () => {
            await clearCalculator()
            for (const digit of num1.toString()) {
                await (await driver.$(`accessibility id:${digit}`))
                    .click()
            }
            for (const digit of num2.toString()) {
                await (await driver.$(`accessibility id:${digit}`))
                    .click()
            }
            await (await driver.$("accessibility id:divide"))
                .click()
            for (const digit of num3.toString()) {
                await (await driver.$(`accessibility id:${digit}`))
                    .click()
            }
            for (const digit of num4.toString()) {
                await (await driver.$(`accessibility id:${digit}`))
                    .click()
            }
            await (await driver.$("accessibility id:equals"))
                .click()

            const result = await driver.$("id:com.google.android.calculator:id/result_final")
            await result.waitForDisplayed()
            const resultText = await result.getText()
            console.log(`Resultado capturado: '${resultText}'`); 
            if (resultText.trim() !== esperado) {
                throw new Error(`Resultado incorreto: esperado '${esperado}', mas obteve '${resultText.trim()}'`)
            }
        })
    })


    fatorialMassa.array.forEach(({ num1, num2, esperado }) => {
        it(`Fatorial de ${num1}${num2}`, async () => {

            await clearCalculator()
            await (await driver.$(`accessibility id:${num1}`))
                .click()

            await (await driver.$(`accessibility id:${num2}`))
                .click()

            await (await driver.$("accessibility id:factorial"))
                .click()

            await (await driver.$("accessibility id:equals"))
                .click()

            const result = await driver.$("id:com.google.android.calculator:id/result_final")
            const resultText = await result.getText()
            if (resultText.trim() !== String(esperado)) {
                throw new Error(`Resultado incorreto: esperado '${esperado}', mas obteve '${resultText.trim()}'`)
            }
        })
    })
})
