/**
 * =================================================================
 *  Banco de Dados de Cenários - Odete's English Class
 * =================================================================
 * 
 * Este arquivo centraliza todos os cenários de role-playing sugeridos,
 * agora organizados por categorias para facilitar a navegação.
 * 
 * ESTRUTURA:
 * O objeto principal SCENARIOS contém chaves que são os nomes das
 * categorias (ex: "✈️ Viagens e Transporte").
 * O valor de cada categoria é um objeto contendo os cenários
 * pertencentes a ela.
 * 
 */

const SCENARIOS = {
    "🍔 Restaurantes e Cafés": {
        "Pedindo um café": {
            "en-US": {
                name: "Ordering a coffee",
                goal: "Order one black coffee and one croissant to go."
            }
        },
        "Reservando uma mesa": {
            "en-US": {
                name: "Booking a restaurant table",
                goal: "Call a restaurant and book a table for two people for this Saturday at 8 PM."
            }
        },
        "Pedindo a conta": {
            "en-US": {
                name: "Asking for the check",
                goal: "You have finished your meal. Get the waiter's attention and ask for the check."
            }
        }
    },

    "✈️ Viagens e Transporte": {
        "Check-in no hotel": {
            "en-US": {
                name: "Checking into a hotel",
                goal: "Check into the hotel with a reservation under the name 'Alex Smith' for two nights."
            }
        },
        "Comprando um ingresso de trem": {
            "en-US": {
                name: "Buying a train ticket",
                goal: "Buy one adult round-trip ticket to Grand Central Station for tomorrow."
            }
        },
        "Pedindo informações no aeroporto": {
            "en-US": {
                name: "Asking for information at the airport",
                goal: "Ask an airline employee where the departure gate for flight BA249 to London is."
            }
        },
        "Pedindo direções na rua": {
            "en-US": {
                name: "Asking for directions on the street",
                goal: "You are lost. Ask a person on the street how to get to the nearest subway station."
            }
        }
    },

    "🛒 Compras": {
        "Comprando roupas": {
            "en-US": {
                name: "Shopping for clothes",
                goal: "Ask a shop assistant if they have a blue T-shirt in a medium size and where the fitting rooms are."
            }
        },
        "Devolvendo um item": {
            "en-US": {
                name: "Returning an item to a store",
                goal: "Return a sweater that is too small and ask for a refund. You have the receipt."
            }
        }
    },

    "🤝 Situações Sociais": {
        "Apresentando-se a alguém": {
            "en-US": {
                name: "Introducing yourself to someone",
                goal: "You are at a party. Introduce yourself to a new person and ask them what they do for a living."
            }
        },
        "Fazendo um novo amigo": {
            "en-US": {
                name: "Making a new friend",
                goal: "Start a conversation with someone at a bus stop. Talk about the weather and ask where they are from."
            }
        }
    },

    "💼 Profissional": {
        "Entrevista de emprego simples": {
            "en-US": {
                name: "Simple job interview",
                goal: "You are in a job interview. Answer the question: 'Tell me a little about yourself'."
            }
        }
    }
};