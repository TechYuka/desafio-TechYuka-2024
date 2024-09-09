import { RecintosZoo } from "./recintos-zoo.js";

describe('Recintos do Zoologico', () => {

    // Testes de validação básica
    test('Deve rejeitar animal inválido', () => {
        const resultado = new RecintosZoo().analisaRecintos('UNICORNIO', 1);
        expect(resultado.erro).toBe("Animal inválido");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve rejeitar quantidade inválida', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 0);
        expect(resultado.erro).toBe("Quantidade inválida");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve rejeitar quantidade negativa', () => {
        const resultado = new RecintosZoo().analisaRecintos('LEAO', -1);
        expect(resultado.erro).toBe("Quantidade inválida");
        expect(resultado.recintosViaveis).toBeFalsy();
    })

    // Teste para animais que não cabem em nenhum recinto
    test('Não deve encontrar recintos para 10 macacos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 10);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    // Testes para encontrar recintos viáveis
    test('Deve encontrar recinto para 1 crocodilo', () => {
        const resultado = new RecintosZoo().analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(1);
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 5 total: 8)');
    });

    test('Deve encontrar recintos para 2 macacos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(3);
        expect(resultado.recintosViaveis).toEqual([
            'Recinto 1 (espaço livre: 5 total: 10)',
            'Recinto 2 (espaço livre: 3 total: 5)',
            'Recinto 3 (espaço livre: 2 total: 7)'
        ]);
    });

    test('Deve encontrar recinto para 2 leões', () => {
        const resultado = new RecintosZoo().analisaRecintos('LEAO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(1);
        expect(resultado.recintosViaveis[0]).toBe('Recinto 5 (espaço livre: 0 total: 9)')
    });

    // Testes de regras específicas
    test('Carnívoros só podem dividir espaço com a própria espécie', () => {
        const resultado = new RecintosZoo().analisaRecintos('LEOPARDO', 1);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Hipopótamos só aceitam outras espécies em savanas com rio', () => {
        const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(2);
        expect(resultado.recintosViaveis).toEqual([
            'Recinto 3 (espaço livre: 0 total: 7)',
            "Recinto 4 (espaço livre: 4 total: 8)"
        ]);
    });

    test('Macacos não se sentem confortáveis sozinhos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(2);
        expect(resultado.recintosViaveis).toEqual([
            'Recinto 1 (espaço livre: 6 total: 10)',
            'Recinto 3 (espaço livre: 3 total: 7)'
        ]);
    });

    // Teste de bugs
    test('Deve considerar espaço adicional para múltiplas espécies', () => {
        const resultado = new RecintosZoo().analisaRecintos('GAZELA', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(2);
        expect(resultado.recintosViaveis).toEqual([
            'Recinto 1 (espaço livre: 4 total: 10)',
            'Recinto 3 (espaço livre: 3 total: 7)'
        ]);
    });

});
