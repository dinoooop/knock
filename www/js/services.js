app.service("moderator", function (transactionService, bankService) {


    this.deleteTheBank = function (index) {
        var banks = bankService.all();
        if (typeof banks[index] != 'undefined') {
            var bankTitle = banks[index].title;
            bankService.delete(index);
            transactionService.deleteAllTransactionsOfBank(bankTitle);
        }

    }



});

app.service("storeService", function () {

    this.all = function (option_name) {
        var option_value = window.localStorage[option_name];
        if (option_value) {
            return angular.fromJson(option_value);
        }
        return [];
    }

    this.update = function (option_name, option_value) {
        var option_value = (option_value == '') ? option_value : angular.toJson(option_value);
        window.localStorage[option_name] = option_value;
    }
});

app.service("transactionService", function (storeService) {

    this.storeTitle = 'transaction_list';

    this.all = function () {
        return storeService.all(this.storeTitle)
    }

    this.add = function (data) {
        var store_list = storeService.all(this.storeTitle);
        data.time = new Date().getTime();
        var new_store = this.refine(data);
        if (new_store.status) {
            store_list.push(new_store.data);
            storeService.update(this.storeTitle, store_list)
        }
    }

    this.update = function (index, data) {
        var store_list = storeService.all(this.storeTitle);
        var edited_store = this.refine(data);
        if (edited_store.status) {
            store_list[index] = edited_store.data;
            storeService.update(this.storeTitle, store_list);
        }
    }

    this.delete = function (index) {
        var store_list = storeService.all(this.storeTitle);
        store_list.splice(index, 1);
        storeService.update(this.storeTitle, store_list);
    }

    this.refine = function (data) {

        if (isNaN(data.amount)) {
            return {status: false}
        }

        return {
            status: true,
            data: {time: data.time, amount: data.amount, bank: data.bank, type: data.type}
        };
    }

    this.deleteAllTransactionsOfBank = function (bankTitle) {
        var transactions = this.all();
        var store_list = transactions.collectiveRemove('bank', bankTitle);
        storeService.update(this.storeTitle, store_list);
    }

    this.setDefault = function () {

        var store_list = [
            {time: "1244323623006", amount: "200", bank: "XL", type: "debit"},
            {time: "1255523653006", amount: "300", bank: "CV", type: "credit"},
            {time: "1288323623006", amount: "500", bank: "CV", type: "debit"},
        ];

        storeService.update(this.storeTitle, store_list);
    }

});


app.service("bankService", function (storeService) {

    this.storeTitle = 'bank_list';

    this.all = function () {
        return storeService.all(this.storeTitle)
    }

    this.add = function (data) {
        var store_list = storeService.all(this.storeTitle);
        var new_store = this.refine(data);
        if (new_store.status) {
            store_list.push(new_store.data);
            storeService.update(this.storeTitle, store_list);
        }
    }

    this.update = function (index, data) {
        var store_list = storeService.all(this.storeTitle);
        var edited_store = this.refine(data);
        if (edited_store.status) {
            store_list[index] = edited_store.data;
            storeService.update(this.storeTitle, store_list);
        }
    }

    this.delete = function (index) {
        var store_list = storeService.all(this.storeTitle);
        store_list.splice(index, 1);
        storeService.update(this.storeTitle, store_list);
    }

    this.refine = function (data) {

        if (isNaN(data.amount)) {
            return {status: false}
        }

        return {
            status: true,
            data: {title: data.title, amount: data.amount}
        };
    }

    this.setDefault = function () {
        // bank list
        var store_list = [
            {title: "CV", amount: "2550"},
            {title: "XL", amount: "4000"},
        ];
        storeService.update(this.storeTitle, store_list);
    }

    // Custom
    this.updateBalance = function (bank_title, amount, type) {

        if (isNaN(amount)) {
            return false;
        }

        var store_list = this.all();
        var obj = store_list.getObj('title', bank_title);


        var index = obj.index;
        var data = obj.data;


        var amount = parseInt(amount)
        var current_balance = parseInt(data.amount);


        if (type == 'credit') {
            current_balance = current_balance + amount;
        } else {
            current_balance = current_balance - amount;
        }

        data.amount = current_balance;

        this.update(index, data);

    }

    this.balance = function (bankTitle) {
        var bank = this.all().getObj('title', bankTitle);
        return bank.data.amount;
    }

});
