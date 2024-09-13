// Logicá para colocar os animais de um zoológico nos recintos adequados; seguindo regras pré estabelecidas

const ESPECIES = {
    LEAO: "LEAO",
    MACACO: "MACACO",
    GAZELA: "GAZELA",
    CROCODILO: "CROCODILO",
    LEOPARDO: "LEOPARDO",
    HIPOPOTAMO: "HIPOPOTAMO"
};

const BIOMAS = {
    SAVANA: "savana",
    FLORESTA: "floresta",
    RIO: "rio",
    SAVANA_RIO: "savana e rio"
};

class RecintosZoo {
    constructor() {
        // Usando Map para os recintos
        this.recintos = new Map([
            [1, { bioma: BIOMAS.SAVANA, tamanho: 10, animais: [{ especie: ESPECIES.MACACO, quantidade: 3 }] }],
            [2, { bioma: BIOMAS.FLORESTA, tamanho: 5, animais: [] }],
            [3, { bioma: BIOMAS.SAVANA_RIO, tamanho: 7, animais: [{ especie: ESPECIES.GAZELA, quantidade: 1 }] }],
            [4, { bioma: BIOMAS.RIO, tamanho: 8, animais: [] }],
            [5, { bioma: BIOMAS.SAVANA, tamanho: 9, animais: [{ especie: ESPECIES.LEAO, quantidade: 1 }] }]
        ]);

        // Lista para animais
        this.animaisPermitidos = {
            [ESPECIES.LEAO]: { tamanho: 3, bioma: [BIOMAS.SAVANA], carnivoro: true },
            [ESPECIES.LEOPARDO]: { tamanho: 2, bioma: [BIOMAS.SAVANA], carnivoro: true },
            [ESPECIES.CROCODILO]: { tamanho: 3, bioma: [BIOMAS.RIO], carnivoro: true },
            [ESPECIES.MACACO]: { tamanho: 1, bioma: [BIOMAS.SAVANA, BIOMAS.FLORESTA], carnivoro: false },
            [ESPECIES.GAZELA]: { tamanho: 2, bioma: [BIOMAS.SAVANA], carnivoro: false },
            [ESPECIES.HIPOPOTAMO]: { tamanho: 4, bioma: [BIOMAS.SAVANA, BIOMAS.RIO], carnivoro: false }
        };

        // Regra de quais recintos permitem quais espécies
        this.recintosPermitidos = {
            [ESPECIES.LEAO]: [5],
            [ESPECIES.LEOPARDO]: [5],
            [ESPECIES.CROCODILO]: [4],
            [ESPECIES.MACACO]: [1, 2, 3],
            [ESPECIES.GAZELA]: [1, 3],
            [ESPECIES.HIPOPOTAMO]: [3, 4]
        };
    }

    // Regra dos carnivoros
    verificaCarnivoro(animal, recinto) {
        if (recinto.animais.length > 0) {
            return!recinto.animais.some(a => a.especie !== animal);
        }
        return true;
    }

    // Regra dos hipopotamos
    verificaHipopotamo(recinto) {
        if (recinto.animais.length > 0 && recinto.bioma !== BIOMAS.SAVANA_RIO && recinto.animais.some(a => a.especie !== ESPECIES.HIPOPOTAMO)) {
            return false;
        }
        return true;
    }

    // Regra dos macacos
    verificaMacaco(quantidade, recinto) {
        if (quantidade < 2 && recinto.animais.length === 0) {
            return false;
        }
        return true;
    }

    analisaRecintos(animal, quantidade) {

        let recintosViaveis = [];  // Cria a variavel de saida inicializada com um array

        // Busca os dados do animal
        const infoAnimal = this.animaisPermitidos[animal];
        
        // Validações iniciais
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        // Varre os recintos em busca dos adequados
        for (const [numero, recinto] of this.recintos.entries()) {

            // Verifica se o recinto é adequado na lista de recintos permitidos
            if (!this.recintosPermitidos[animal].includes(numero)) {
                continue;
            }

            // Calcula o espaço disponível no recinto
            const espacoOcupado = recinto.animais.reduce((total, a) => {
                return total + (this.animaisPermitidos[a.especie].tamanho * a.quantidade);
            }, 0);

            // Declara o espaço livre no recinto
            let espacoLivre = recinto.tamanho - espacoOcupado;

            const espacoNecessario = infoAnimal.tamanho * quantidade;

            // Regras carnívoros
            if (infoAnimal.carnivoro && !this.verificaCarnivoro(animal, recinto)) {
                continue;
            }

            // Regra macacos
            if (animal === ESPECIES.MACACO && !this.verificaMacaco(quantidade, recinto)) {
                continue;
            }

            // Regra hipopótamos
            if (animal === ESPECIES.HIPOPOTAMO && !this.verificaHipopotamo(recinto)) {
                continue;
            }

            // -1 espaço para recintos com mais de uma especie
            if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) {
                espacoLivre -= 1;
            }

            // Verifica se há espaço suficiente se sim armazena os dados na variavel recintosViaveis 
            if (espacoLivre >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanho})`);
            }
        }

        // Retorna a variavel de recintos viáveis ou erro se nenhum for encontrado
        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };