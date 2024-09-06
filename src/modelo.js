class RecintosZoo {
    constructor() {
        // Recintos disponíveis no zoológico
        this.recintos = [
            { numero: 1, bioma: "savana", tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        // Tabela de animais e biomas
        this.animaisPermitidos = {
            "LEAO": { tamanho: 3, bioma: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, bioma: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, bioma: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, bioma: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validações
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const infoAnimal = this.animaisPermitidos[animal];
        let recintosViaveis = [];

        // Itera sobre cada recinto para verificar se é viável
        for (const recinto of this.recintos) {
            // Verifica se o bioma é compatível
            if (!infoAnimal.bioma.includes(recinto.bioma)) {
                continue; // Pula para o próximo recinto
            }

            // Calcula o espaço disponível no recinto
            const espacoOcupado = recinto.animais.reduce((total, a) => {
                return total + (this.animaisPermitidos[a.especie].tamanho * a.quantidade);
            }, 0);

            const espacoLivre = recinto.tamanho - espacoOcupado;
            const espacoNecessario = infoAnimal.tamanho * quantidade;

            // Verifica se há espaço suficiente
            if (espacoLivre >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanho})`);
            }
        }

        // Retorna a lista de recintos viáveis ou erro se nenhum for encontrado
        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };
