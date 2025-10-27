/**
 * =================================================================
 *  Banco de Dados de Cenários - Odete's English Class
 * =================================================================
 * 
 * Este arquivo centraliza todos os cenários de role-playing,
 * organizados por categorias e com uma progressão de dificuldade.
 * 
 * ESTRUTURA:
 * O objeto principal SCENARIOS contém chaves que são os nomes das
 * categorias. O valor de cada categoria é um objeto contendo os 
 * 12 cenários pertencentes a ela.
 * 
 */

const SCENARIOS = {
    "🍔 Restaurantes e Cafés": {
        "Pedindo um café simples": {
            "en-US": {
                name: "Ordering a simple coffee",
                goal: "Go to a coffee shop and order one black coffee to go."
            }
        },
        "Pedindo a conta": {
            "en-US": {
                name: "Asking for the check",
                goal: "You have finished your meal. Get the waiter's attention and ask for the check."
            }
        },
        "Pedindo uma mesa para dois": {
            "en-US": {
                name: "Asking for a table for two",
                goal: "Enter a restaurant and ask the host for a table for two people."
            }
        },
        "Fazendo um pedido do cardápio": {
            "en-US": {
                name: "Ordering from the menu",
                goal: "The waiter is ready to take your order. Order a cheeseburger with fries and a soda."
            }
        },
        "Reservando uma mesa por telefone": {
            "en-US": {
                name: "Booking a table by phone",
                goal: "Call a restaurant and book a table for four people for this Friday at 8 PM."
            }
        },
        "Perguntando sobre ingredientes (alergia)": {
            "en-US": {
                name: "Asking about ingredients (allergy)",
                goal: "Ask the waiter if the chicken pasta dish contains any nuts, as you have an allergy."
            }
        },
        "Pedindo recomendações ao garçom": {
            "en-US": {
                name: "Asking the waiter for recommendations",
                goal: "You are undecided. Ask the waiter what the most popular dish on the menu is."
            }
        },
        "Reclamando de um prato frio": {
            "en-US": {
                name: "Complaining about a cold dish",
                goal: "Your steak has arrived cold. Politely get the waiter's attention and ask them to heat it up."
            }
        },
        "Pedindo para dividir a conta": {
            "en-US": {
                name: "Asking to split the check",
                goal: "You ate with a friend. Ask the waiter if it's possible to split the check evenly between two people."
            }
        },
        "Reclamando de um item errado no pedido": {
            "en-US": {
                name: "Complaining about a wrong item in the order",
                goal: "You ordered a vegetarian pizza, but you received one with pepperoni. Inform the waiter about the mistake."
            }
        },
        "Questionando um valor na conta": {
            "en-US": {
                name: "Questioning a charge on the bill",
                goal: "You see an extra charge on your bill for a drink you didn't order. Ask the waiter to explain and correct it."
            }
        },
        "Reclamando do serviço com o gerente": {
            "en-US": {
                name: "Complaining about the service to the manager",
                goal: "The service has been extremely slow and the waiter was rude. Ask to speak to the manager to make a formal complaint."
            }
        }
    },

    "✈️ Viagens e Transporte": {
        "Comprando um bilhete de metrô": {
            "en-US": {
                name: "Buying a subway ticket",
                goal: "Go to a ticket machine or counter and buy one single-journey ticket."
            }
        },
        "Pedindo direções na rua": {
            "en-US": {
                name: "Asking for directions on the street",
                goal: "You are lost. Ask a person on the street how to get to the nearest museum."
            }
        },
        "Fazendo check-in no voo": {
            "en-US": {
                name: "Checking in for a flight",
                goal: "Go to the airline counter, say you want to check in for your flight to New York, and that you have one bag to check."
            }
        },
        "Passando pela segurança do aeroporto": {
            "en-US": {
                name: "Going through airport security",
                goal: "An agent asks you to remove your laptop from your bag and take off your shoes. Acknowledge and follow the instructions."
            }
        },
        "Fazendo check-in no hotel": {
            "en-US": {
                name: "Checking into a hotel",
                goal: "Check into the hotel with a reservation under the name 'Alex Smith' for two nights."
            }
        },
        "Pedindo informações no aeroporto": {
            "en-US": {
                name: "Asking for information at the airport",
                goal: "Ask an airline employee where the departure gate for flight BA249 to London is."
            }
        },
        "Reportando uma bagagem perdida": {
            "en-US": {
                name: "Reporting a lost baggage",
                goal: "Your checked bag did not arrive. Go to the lost and found desk and report your missing suitcase."
            }
        },
        "Perguntando sobre um voo atrasado": {
            "en-US": {
                name: "Asking about a delayed flight",
                goal: "Your flight is delayed. Ask an airline employee for the new departure time and the reason for the delay."
            }
        },
        "Alugando um carro": {
            "en-US": {
                name: "Renting a car",
                goal: "Go to a car rental desk. Say you have a reservation for a compact car and ask about insurance options."
            }
        },
        "Reclamando do barulho no quarto do hotel": {
            "en-US": {
                name: "Complaining about noise in the hotel room",
                goal: "The room next to yours is being very loud late at night. Call the front desk to complain and ask them to intervene."
            }
        },
        "Tentando remarcar um voo cancelado": {
            "en-US": {
                name: "Trying to rebook a cancelled flight",
                goal: "Your flight was cancelled due to weather. Go to the airline counter and ask to be booked on the next available flight."
            }
        },
        "Resolvendo um problema na conta do hotel": {
            "en-US": {
                name: "Resolving a hotel bill issue",
                goal: "You are checking out and see charges from the minibar that you did not consume. Explain the situation to the receptionist and ask for the charges to be removed."
            }
        }
    },

    "🛒 Compras": {
        "Perguntando o preço de um item": {
            "en-US": {
                name: "Asking for the price of an item",
                goal: "Find a shirt you like but it doesn't have a price tag. Ask a shop assistant how much it costs."
            }
        },
        "Procurando por um produto": {
            "en-US": {
                name: "Looking for a product",
                goal: "You are in a supermarket. Ask an employee in which aisle you can find pasta."
            }
        },
        "Pagando pelas compras": {
            "en-US": {
                name: "Paying for your shopping",
                goal: "You are at the cashier. Say you would like to pay with a credit card."
            }
        },
        "Pedindo um tamanho ou cor diferente": {
            "en-US": {
                name: "Asking for a different size or color",
                goal: "Ask a shop assistant if they have a blue T-shirt in a medium size."
            }
        },
        "Perguntando onde ficam os provadores": {
            "en-US": {
                name: "Asking for the fitting rooms",
                goal: "You want to try on some jeans. Ask a store employee where the fitting rooms are."
            }
        },
        "Devolvendo um item com defeito": {
            "en-US": {
                name: "Returning a faulty item",
                goal: "Return a pair of headphones that stopped working after one day. You have the receipt and want a refund."
            }
        },
        "Perguntando sobre a política de devolução": {
            "en-US": {
                name: "Asking about the return policy",
                goal: "Before buying a gift, ask the cashier how many days the person has to return or exchange the item."
            }
        },
        "Pedindo um desconto": {
            "en-US": {
                name: "Asking for a discount",
                goal: "You are buying a display model of a TV that has a small scratch. Ask the manager if they can offer a discount."
            }
        },
        "Inscrevendo-se em um programa de fidelidade": {
            "en-US": {
                name: "Signing up for a loyalty program",
                goal: "The cashier asks if you want to join their free loyalty program. Ask what the benefits are before deciding."
            }
        },
        "Reportando um produto vencido na prateleira": {
            "en-US": {
                name: "Reporting an expired product on the shelf",
                goal: "You found a carton of milk on the shelf that is past its expiration date. Politely inform a store employee."
            }
        },
        "Reclamando de propaganda enganosa": {
            "en-US": {
                name: "Complaining about false advertising",
                goal: "An item was advertised at a special price, but it scanned at the full price. Show the advertisement to the cashier and ask them to honor the discount."
            }
        },
        "Falando com o gerente da loja": {
            "en-US": {
                name: "Speaking with the store manager",
                goal: "A salesperson was very unhelpful and rude. Ask to speak to the store manager to report the incident."
            }
        }
    },

    "🤝 Situações Sociais": {
        "Apresentando-se em uma festa": {
            "en-US": {
                name: "Introducing yourself at a party",
                goal: "You are at a party. Introduce yourself to a new person and ask them what they do for a living."
            }
        },
        "Falando sobre o tempo": {
            "en-US": {
                name: "Talking about the weather",
                goal: "Start a small talk conversation with someone at a bus stop. Make a comment about the beautiful weather."
            }
        },
        "Elogiando alguém": {
            "en-US": {
                name: "Giving a compliment",
                goal: "You like your colleague's new haircut. Give them a compliment."
            }
        },
        "Convidando um amigo para um café": {
            "en-US": {
                name: "Inviting a friend for coffee",
                goal: "Ask your friend if they are free to get a coffee together sometime this week."
            }
        },
        "Aceitando um convite": {
            "en-US": {
                name: "Accepting an invitation",
                goal: "A friend invites you to their birthday party on Saturday. Enthusiastically accept the invitation and ask if you should bring anything."
            }
        },
        "Recusando um convite educadamente": {
            "en-US": {
                name: "Declining an invitation politely",
                goal: "A colleague invites you to a movie, but you already have plans. Politely decline and thank them for the invitation."
            }
        },
        "Pedindo um favor a um vizinho": {
            "en-US": {
                name: "Asking a neighbor for a favor",
                goal: "You are going on vacation. Ask your neighbor if they could water your plants for you while you're away."
            }
        },
        "Contando sobre seu fim de semana": {
            "en-US": {
                name: "Telling about your weekend",
                goal: "A coworker asks you what you did over the weekend. Briefly describe one or two activities you did."
            }
        },
        "Juntando-se a uma conversa em andamento": {
            "en-US": {
                name: "Joining an ongoing conversation",
                goal: "Your friends are discussing a movie you've seen. Find a good moment to join the conversation and share your opinion."
            }
        },
        "Discordando educadamente de uma opinião": {
            "en-US": {
                name: "Disagreeing politely with an opinion",
                goal: "Someone says they dislike a book that you love. Express your different opinion respectfully."
            }
        },
        "Terminando uma conversa educadamente": {
            "en-US": {
                name: "Ending a conversation politely",
                goal: "You have been talking to someone for a while, but now you need to leave. Politely end the conversation."
            }
        },
        "Confortando um amigo": {
            "en-US": {
                name: "Comforting a friend",
                goal: "Your friend is sad because they had a bad day at work. Offer words of comfort and support."
            }
        }
    },

    "💼 Profissional": {
        "Entrevista: 'Fale-me sobre você'": {
            "en-US": {
                name: "Interview: 'Tell me about yourself'",
                goal: "You are in a job interview. Answer the question: 'Tell me a little about yourself'."
            }
        },
        "Apresentando-se a um colega": {
            "en-US": {
                name: "Introducing yourself to a colleague",
                goal: "It's your first day. Introduce yourself to a new team member and ask what they are working on."
            }
        },
        "Pedindo ajuda a um colega": {
            "en-US": {
                name: "Asking a colleague for help",
                goal: "You are stuck on a task. Ask a more experienced colleague if they have a moment to help you."
            }
        },
        "Agendando uma reunião": {
            "en-US": {
                name: "Scheduling a meeting",
                goal: "Send a message or talk to a coworker to schedule a 30-minute meeting for tomorrow to discuss the new project."
            }
        },
        "Dando uma atualização em uma reunião": {
            "en-US": {
                name: "Giving an update in a meeting",
                goal: "In a team meeting, your manager asks for your progress. Give a brief update on what you completed last week."
            }
        },
        "Pedindo feedback sobre seu trabalho": {
            "en-US": {
                name: "Asking for feedback on your work",
                goal: "You have just finished a report. Ask your manager if they have time to review it and give you some feedback."
            }
        },
        "Avisando que vai se atrasar": {
            "en-US": {
                name: "Informing you will be late",
                goal: "You are stuck in traffic and will be 15 minutes late for work. Call or message your boss to inform them."
            }
        },
        "Lidando com uma ligação de cliente": {
            "en-US": {
                name: "Handling a customer call",
                goal: "Answer a phone call from a customer who wants to know the status of their order."
            }
        },
        "Apresentando uma ideia simples": {
            "en-US": {
                name: "Pitching a simple idea",
                goal: "You have an idea to improve a process. Briefly explain your idea to your team during a brainstorming session."
            }
        },
        "Discordando de uma decisão em uma reunião": {
            "en-US": {
                name: "Disagreeing with a decision in a meeting",
                goal: "In a meeting, a decision is made that you disagree with. Politely express your concern and explain your reasoning."
            }
        },
        "Negociando um prazo": {
            "en-US": {
                name: "Negotiating a deadline",
                goal: "Your boss gives you a new task with a tight deadline. Explain your current workload and ask if the deadline can be extended."
            }
        },
        "Lidando com um cliente irritado": {
            "en-US": {
                name: "Dealing with an angry customer",
                goal: "A customer calls to complain angrily about a product. Listen to their problem, apologize for the inconvenience, and offer a solution."
            }
        }
    },
    
    "🎓 Estudos": {
        "Apresentando-se na aula": {
            "en-US": {
                name: "Introducing yourself in class",
                goal: "It's the first day of class and the teacher asks everyone to introduce themselves. State your name, where you are from, and why you are taking the class."
            }
        },
        "Pedindo material emprestado": {
            "en-US": {
                name: "Borrowing class material",
                goal: "You forgot your pen. Politely ask the classmate next to you if you can borrow one."
            }
        },
        "Pedindo ajuda na biblioteca": {
            "en-US": {
                name: "Asking for help at the library",
                goal: "You can't find a book for your research paper. Ask the librarian for help locating it."
            }
        },
        "Tirando uma dúvida com o professor": {
            "en-US": {
                name: "Asking a professor a question",
                goal: "After the lecture, approach the professor to ask a question to clarify a concept you didn't understand."
            }
        },
        "Combinando um estudo em grupo": {
            "en-US": {
                name: "Arranging a group study session",
                goal: "Talk to your classmates and suggest studying together for the upcoming exam. Propose a time and place."
            }
        },
        "Discutindo um projeto em grupo": {
            "en-US": {
                name: "Discussing a group project",
                goal: "You are in a meeting with your project group. Your task is to delegate responsibilities for each part of the project."
            }
        },
        "Marcando uma reunião com um orientador": {
            "en-US": {
                name: "Scheduling a meeting with an advisor",
                goal: "You need to discuss your course selection for the next semester. Write an email or talk to the academic advisor to schedule an appointment."
            }
        },
        "Informando uma ausência ao professor": {
            "en-US": {
                name: "Informing a professor about an absence",
                goal: "You are sick and cannot attend class tomorrow. Inform your professor and ask about any material you will miss."
            }
        },
        "Debatendo um tópico em sala": {
            "en-US": {
                name: "Debating a topic in the classroom",
                goal: "The teacher presents a topic for debate. Express your opinion on the topic and provide one reason to support it."
            }
        },
        "Pedindo uma extensão de prazo": {
            "en-US": {
                name: "Asking for a deadline extension",
                goal: "You have too many assignments due at the same time. Politely ask your professor if it is possible to get a small extension on your paper."
            }
        },
        "Apresentando um trabalho para a turma": {
            "en-US": {
                name: "Presenting a project to the class",
                goal: "It's your turn to present. Start your presentation by introducing your topic to the class."
            }
        },
        "Resolvendo um conflito em um grupo de estudo": {
            "en-US": {
                name: "Resolving a conflict in a study group",
                goal: "One member of your group is not doing their part of the work. You need to talk to them about the importance of their contribution."
            }
        }
    },
    
    "❤️ Saúde e Bem-estar": {
        "Comprando um analgésico": {
            "en-US": {
                name: "Buying a painkiller",
                goal: "Go to a pharmacy and ask the pharmacist for something to relieve a headache."
            }
        },
        "Marcando uma consulta médica": {
            "en-US": {
                name: "Scheduling a doctor's appointment",
                goal: "Call a clinic to schedule an appointment with a general doctor for as soon as possible."
            }
        },
        "Fazendo o registro na clínica": {
            "en-US": {
                name: "Checking in at the clinic",
                goal: "You have arrived for your appointment. Go to the front desk, state your name and appointment time."
            }
        },
        "Descrevendo sintomas de gripe": {
            "en-US": {
                name: "Describing flu symptoms",
                goal: "The doctor asks what's wrong. Tell them you have a fever, a cough, and a sore throat."
            }
        },
        "Pedindo uma receita médica": {
            "en-US": {
                name: "Asking for a prescription refill",
                goal: "Call your doctor's office and ask them to send a prescription refill for your medication to your local pharmacy."
            }
        },
        "Perguntando sobre efeitos colaterais": {
            "en-US": {
                name: "Asking about side effects",
                goal: "The doctor prescribed a new medication. Ask if there are any common side effects you should be aware of."
            }
        },
        "Marcando uma consulta no dentista": {
            "en-US": {
                name: "Making a dentist appointment",
                goal: "You have a toothache. Call a dental office and schedule an emergency appointment."
            }
        },
        "Explicando uma lesão": {
            "en-US": {
                name: "Explaining an injury",
                goal: "You fell while running and hurt your ankle. Explain to the doctor how it happened and where it hurts."
            }
        },
        "Perguntando sobre os resultados de um exame": {
            "en-US": {
                name: "Asking about test results",
                goal: "Call the clinic to ask if the results of your recent blood test are available."
            }
        },
        "Discutindo opções de tratamento": {
            "en-US": {
                name: "Discussing treatment options",
                goal: "The doctor gives you a diagnosis and presents two different treatment options. Ask about the pros and cons of each."
            }
        },
        "Ligando para uma ambulância": {
            "en-US": {
                name: "Calling for an ambulance",
                goal: "Someone has collapsed on the street. Call emergency services, state your location, and describe the situation."
            }
        },
        "Visitando um amigo no hospital": {
            "en-US": {
                name: "Visiting a friend in the hospital",
                goal: "Go to the hospital's information desk and ask for your friend's room number and what the visiting hours are."
            }
        }
    },
    
    "🏠 Moradia e Serviços": {
        "Recebendo uma encomenda": {
            "en-US": {
                name: "Receiving a package",
                goal: "A delivery person is at your door with a package. You need to sign for it."
            }
        },
        "Pedindo para baixar o volume": {
            "en-US": {
                name: "Asking to lower the volume",
                goal: "Your neighbor is playing very loud music late at night. Knock on their door and politely ask them to turn it down."
            }
        },
        "Reportando um vazamento": {
            "en-US": {
                name: "Reporting a leak",
                goal: "You notice a water leak under your kitchen sink. Call your landlord or building manager to report the problem."
            }
        },
        "Agendando a instalação da internet": {
            "en-US": {
                name: "Scheduling an internet installation",
                goal: "Call an internet service provider to schedule an appointment for a technician to come and install your new internet service."
            }
        },
        "Falando com um técnico de reparos": {
            "en-US": {
                name: "Talking to a repair technician",
                goal: "A technician has arrived to fix your washing machine. Explain to them what the problem is."
            }
        },
        "Trancado para fora de casa": {
            "en-US": {
                name: "Locked out of your apartment",
                goal: "You've locked your keys inside your apartment. Call your landlord to see if they have a spare key or can help."
            }
        },
        "Contratando um serviço de limpeza": {
            "en-US": {
                name: "Hiring a cleaning service",
                goal: "Call a cleaning company to ask about their prices and to book a one-time cleaning service for your apartment."
            }
        },
        "Perguntando sobre as regras do condomínio": {
            "en-US": {
                name: "Asking about building rules",
                goal: "You want to have a small party. Ask your building manager about the rules regarding noise and guests."
            }
        },
        "Discutindo um problema de pragas": {
            "en-US": {
                name: "Discussing a pest problem",
                goal: "You have noticed ants in your kitchen. Inform your landlord and ask for pest control to be sent."
            }
        },
        "Contestando uma conta de serviços": {
            "en-US": {
                name: "Disputing a utility bill",
                goal: "Your electricity bill this month is much higher than usual. Call the utility company to question the charges."
            }
        },
        "Entendendo um contrato de aluguel": {
            "en-US": {
                name: "Understanding a lease agreement",
                goal: "Before signing a lease, you have a question about the policy on pets. Ask the landlord to clarify it for you."
            }
        },
        "Terminando seu contrato de aluguel": {
            "en-US": {
                name: "Terminating your lease agreement",
                goal: "You need to move out before your lease ends. Talk to your landlord to ask about the procedure and any potential penalties."
            }
        }
    }
};