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

        // Tabela de animais e biomas permitidos
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
        // Validações iniciais
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        // Busca os dados do animal da lista
        const infoAnimal = this.animaisPermitidos[animal];
        let recintosViaveis = [];

        // Regras de alocação específicas para cada animal
        const recintosPermitidos = {
            "LEAO": [5],
            "LEOPARDO": [5],
            "CROCODILO": [4],
            "MACACO": [1, 2, 3],
            "GAZELA": [1, 3],
            "HIPOPOTAMO": [3, 4]
        };

        // Busca recinto viável
        for (const recinto of this.recintos) {
            // Verifica se o recinto está na lista de recintos permitidos para o animal
            if (!recintosPermitidos[animal].includes(recinto.numero)) {
                continue;
            }

            // Calcula o espaço disponível no recinto
            const espacoOcupado = recinto.animais.reduce((total, a) => {
                return total + (this.animaisPermitidos[a.especie].tamanho * a.quantidade);
            }, 0);

            let espacoLivre = recinto.tamanho - espacoOcupado;
            const espacoNecessario = infoAnimal.tamanho * quantidade;

            // Regras específicas para carnívoros
            if (infoAnimal.carnivoro && recinto.animais.length > 0) {
                const outrasEspeciesCarnivoros = recinto.animais.some(a => !this.animaisPermitidos[a.especie].carnivoro);
                if (outrasEspeciesCarnivoros) {
                    continue;
                }
            }

            // Regras específicas para hipopótamos
            if (animal === "HIPOPOTAMO") {
                const outrasEspecies = recinto.animais.length > 0;
                if (outrasEspecies && recinto.bioma !== "savana e rio") {
                    continue;
                }
            }

            // Regras específicas para macacos
            if (animal === "MACACO" && quantidade < 2 && recinto.animais.length === 0) {
                continue;
            }

            // Considera 1 espaço extra se houver mais de uma espécie no recinto
            if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) {
                espacoLivre -= 1;
            }

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
