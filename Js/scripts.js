const Modal = {
    open(){
        //abrir modal
        //adicionar modal a class active
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close(){
        //fechar modal
        //remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }

}

//preciso guarda meus dados no localstorage do Browser
//passamos duas function GET E SET
//GET => PEGA AS INFORMAÇÃO 
//SET => PARA GUARDAS AS INFORMAÇÃO
const  Storage ={
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transaction")) || 
        []
    },
    set(transactions){
        //pra setar um valor passamos dois arugumento chave (passa nome pra pesquisar por qual nome busco a chave) e valor
        //localStorage sempre armazenara String 
        localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions))
    },

}

//preciso somar as entradas 
//depois preciso somar as saidas e 
//remover das entradas o valor das saidas
//assim terei meu total.
const Transaction = {
    all: Storage.get(),
    add(trasaction){
        Transaction.all.push(trasaction)
       App.reload()
    },
    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()

    },
    incomes(){
        let income = 0;
        //somar as entradas
        //para cada transection ,
        Transaction.all.forEach(transaction => {
            //se ele for maior que zero
            if(transaction.amount > 0 ){
                 // somar a uma variavel e retorna a variavel
                income = income + transaction.amount
            }
        })
        //somar uma variavel e retorna uma varialvel
        return income;

    },
    expenses(){
        let expense = 0;
        //somar as entradas
        //para cada transection ,
        Transaction.all.forEach(transaction => {
            //se ele for maior que zero
            if(transaction.amount < 0 ){
                 // somar a uma variavel e retorna a variavel
                 expense = expense + transaction.amount
            }
        })
        //somar uma variavel e retorna uma varialvel
        return expense;

    },
    total(){
        //entradas - saidas = total 
        return Transaction.incomes() + Transaction.expenses();
    }
}

//Substitui os dados so hmtl peloo do javascript
//preciso pega minhas transections do meu 
//objeto aqui no javascript
// e colocar no HTML

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction,index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.append(tr)
    },

    innerHTMLTransaction(transaction, index){
        const CSSclas = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
        
            <td  class="description">${transaction.description}</td>
            <td  class="${CSSclas}">${amount}</td></td>
            <td  class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Reover Trasaçao">
            </td>

        `
        return html

    },
    updateBalance(){
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }

}


const Utils ={
    formatAmount(value){
        value = Number(value) * 100
        return value
    },
    formatDate(date){
       const splittedDate = date.split("-")
       return `${splittedDate[2]}/ ${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-br",{
            style: "currency",
            currency:"BRL"
        })
        return signal + value ;
    }
}


const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    //verificaocao dos campos
    validateFields(){
        const {description, amount, date} = Form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos corretamente")
        }
    },
    formatValues(){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        
        return{
            description,
            amount,
            date
        }
    },
    saveTrasaction(transaction){
        Transaction.add(transaction)
    },
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event){
        event.preventDefault()
        //vereficar se todas informação foram prenchidas
        try{
            Form.validateFields()
            //formatar os dados para salvar 
           const transaction = Form.formatValues()
            //salvar
            Form.saveTrasaction(transaction)
            //apagar os dados do formulario
            Form.clearFields()
            //modal feche
            Modal.close()

        }catch(error){
            alert(error.message)

        }
     
    }
}




/**
 DOM.addTransaction(transactions[0])
DOM.addTransaction(transactions[1])
DOM.addTransaction(transactions[2])

for(let i = 0; i < 3; i++){
    console.log(i)
}
 */
const App = {
    init(){
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()
        Storage.set(Transaction.all)
 
    
},

    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()





