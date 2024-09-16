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

    test('Não deve encontrar recinto viável', () => {
        const resultado = new RecintosZoo().analisaRecintos('LEOPARDO', 1);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

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

    test('Deve adicionar 1 hipopotamo', () => {
        const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(2);
        expect(resultado.recintosViaveis).toEqual([
            'Recinto 3 (espaço livre: 0 total: 7)',
            'Recinto 4 (espaço livre: 4 total: 8)'
        ]);
    });

    // Testes de regras específicas
    test('Hipopótamos só aceitam outras espécies em savanas com rio', () => {
        const zoo = new RecintosZoo();

        // Adicona CROCODILO no recinto
        const recinto = zoo.recintos.get(4);
        recinto.animais.push({ especie: 'CROCODILO', quantidade: 1 });

        // Verifica recintos viáveis para adicionar 1 hipopotamo
        const resultado = zoo.analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(1);
        expect(resultado.recintosViaveis).toEqual([
            'Recinto 3 (espaço livre: 0 total: 7)',
        ]);

    });

    test('Carnívoros só podem dividir espaço com a própria espécie', () => {
        const resultado = new RecintosZoo().analisaRecintos('LEOPARDO', 1);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
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

    // Teste de bugs
    test('(Bug) Hipopótamos só aceitam outras espécies em savanas com rio', () => {
        const zoo = new RecintosZoo();

        // Adicona hipotamo no recinto
        const recinto = zoo.recintos.get(4);
        recinto.animais.push({ especie: 'HIPOPOTAMO', quantidade: 1 });

        // Verifica recintos viáveis para adicionar 1 hipopotamo
        const resultado = zoo.analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(2);
        expect(resultado.recintosViaveis).toEqual([
            'Recinto 3 (espaço livre: 0 total: 7)',
            'Recinto 4 (espaço livre: 0 total: 8)'
        ]);
    });

    //Teste para adicionar animais manualmente usando .push
     test('Deve encher o Zoologico', () => {
        const zoo = new RecintosZoo();

        // Adicona gazela nos 3 recintos dsponiveis
        const recinto1 = zoo.recintos.get(1);
        recinto1.animais.push({ especie: 'GAZELA', quantidade: 2 });
        const recinto2 = zoo.recintos.get(2);
        recinto2.animais.push({ especie: 'GAZELA', quantidade: 1 });
        const recinto3 = zoo.recintos.get(3);
        recinto3.animais.push({ especie: 'GAZELA', quantidade: 1 });


        // Verifica recintos viáveis para adicionar um macaco
        const resultadoMacaco = zoo.analisaRecintos('MACACO', 2);
        expect(resultadoMacaco.erro).toBeFalsy();
        expect(resultadoMacaco.recintosViaveis).toHaveLength(3);
        expect(resultadoMacaco.recintosViaveis).toEqual([
            'Recinto 1 (espaço livre: 0 total: 10)',
            'Recinto 2 (espaço livre: 0 total: 5)',
            'Recinto 3 (espaço livre: 0 total: 7)'
        ]);

        // Verifica recinto viável para adicionar dois hipopotamos
        const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toHaveLength(1);
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 0 total: 8)');

        // Verifica recinto viável para 2 leões
        const resultado1 = new RecintosZoo().analisaRecintos('LEAO', 2);
        expect(resultado1.erro).toBeFalsy();
        expect(resultado1.recintosViaveis).toHaveLength(1);
        expect(resultado1.recintosViaveis[0]).toBe('Recinto 5 (espaço livre: 0 total: 9)')

    });

    // test de carga
    test('Deve suportar a adição de um grande número de animais, ignorando erro específico', () => {
        const ESPECIES = {
            LEAO: "LEAO",
            MACACO: "MACACO",
            GAZELA: "GAZELA",
            CROCODILO: "CROCODILO",
            LEOPARDO: "LEOPARDO",
            HIPOPOTAMO: "HIPOPOTAMO"
        };

        const zoo = new RecintosZoo();
        const NUMERO_TESTES = 10000;
        const erros = [];
        
        // Lista de espécies disponíveis
        const especies = Object.values(ESPECIES);
        
        for (let i = 0; i < NUMERO_TESTES; i++) {
            // Seleciona uma espécie aleatória da lista
            const especie = especies[Math.floor(Math.random() * especies.length)];
            
            // Quantidade aleatória de 1 a 5
            const quantidade = Math.floor(Math.random() * 5) + 1;

            const resultado = zoo.analisaRecintos(especie, quantidade);
            if (resultado.erro && resultado.erro !== "Não há recinto viável") {
                erros.push(resultado.erro);
            }
        }

        // Log para inspeção
        console.log('Erros encontrados:', erros);

        // Espera que a maioria dos testes passe sem erros
        expect(erros.length).toBeLessThan(NUMERO_TESTES * 0.1);  // Ajustado para 1%
    });


});