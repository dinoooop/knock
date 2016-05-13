app.service("moderator", function (transactionService, bankService, storeService) {

    this.lastBank = 'last_bank_transaction';

    this.deleteTheBank = function (bankId) {
        bankService.delete(bankId);
        transactionService.deleteAllTransactionsOfBank(bankId);
        this.setLastBank();
    }

    this.setLastBank = function (bankId) {
        if (typeof bankId != "undefined") {
            storeService.update(this.lastBank, bankId);

        } else {
            var banks = bankService.all();
            var last = banks[0].id;
            storeService.update(this.lastBank, last);
        }
    }


    this.getLastBank = function () {
        var lastBank = storeService.all(this.lastBank);
        if (lastBank == "") {
            var banks = bankService.all();
            var last = banks[0].id;
            storeService.update(this.lastBank, last);
            return last;
        } else {
            return lastBank;
        }
    }

    this.makeTransaction = function (data) {
        transactionService.add(data);
        bankService.updateBalance(data.bank_id, data.amount, data.type);
        this.setLastBank(data.bank_id);
    }

    this.loadDefault = function () {

        var banks = bankService.all();

        if (banks.length == 0) {
            bankService.setDefault();
            transactionService.setDefault();
            this.setLastBank();
        }

    }

    this.deleteTheTransaction = function (transactionId) {

        var transaction = transactionService.get(transactionId);

        // the twist
        var type = (transaction.type == 'debit') ? 'credit' : 'debit';

        bankService.updateBalance(transaction.bank_id, transaction.amount, type);
        transactionService.delete(transactionId);
    }

    this.updateBank = function (fd) {
        var data = {id: fd.the_id, amount: fd.the_amount, title: fd.the_title};
        bankService.update(fd.the_id, data);

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
    this.storeId = 'transaction_id_count';

    this.getId = function () {
        var id = storeService.all(this.storeId);

        if (id == "") {
            id = 1;
            storeService.update(this.storeId, id);

        } else {
            id = parseInt(id) + 1;
            storeService.update(this.storeId, id);
        }
        return id;
    }

    this.all = function () {
        return storeService.all(this.storeTitle);
    }

    this.get = function (id) {
        var store_list = this.all();
        return store_list.getObj('id', id).data;
    }

    this.add = function (data) {
        var store_list = storeService.all(this.storeTitle);
        data.time = new Date().getTime();
        data.id = this.getId();
        var new_store = this.refine(data);
        if (new_store.status) {
            store_list.push(new_store.data);
            storeService.update(this.storeTitle, store_list)
        }
    }

    this.update = function (id, data) {

        var store_list = storeService.all(this.storeTitle);
        var index = store_list.getObj('id', id).index;

        var edited_store = this.refine(data);

        if (edited_store.status) {
            store_list[index] = edited_store.data;
            storeService.update(this.storeTitle, store_list);
        }
    }

    this.delete = function (id) {

        var store_list = storeService.all(this.storeTitle);
        var index = store_list.getObj('id', id).index;
        store_list.splice(index, 1);

        storeService.update(this.storeTitle, store_list);
    }

    this.refine = function (data) {

        if (isNaN(data.amount)) {
            return {status: false}
        }

        return {
            status: true,
            data: {id: data.id, time: data.time, amount: data.amount, bank_id: data.bank_id, type: data.type}
        };
    }

    this.getAllTransactionsOfBank = function (bankId) {
        var transactions = this.all();
        return transactions.getObjs('bank_id', bankId);
    }

    this.deleteAllTransactionsOfBank = function (bankId) {
        var transactions = this.all();
        var store_list = transactions.collectiveRemove('bank_id', bankId);
        storeService.update(this.storeTitle, store_list);
    }

    this.setDefault = function () {

        var store_list = [
            {id: "1", time: "1462865887779", amount: "300", bank_id: "1", type: "credit"},
            {id: "2", time: "1462867475845", amount: "500", bank_id: "2", type: "debit"},
        ];

        storeService.update(this.storeTitle, store_list);
        storeService.update(this.storeId, store_list.length);

    }

});


app.service("bankService", function (storeService) {

    this.storeTitle = 'bank_list';
    this.storeId = 'bank_list_id';

    this.all = function () {
        return storeService.all(this.storeTitle)
    }

    this.get = function (id) {
        var store_list = this.all();
        return store_list.getObj('id', id).data;
    }

    this.getId = function () {
        var id = storeService.all(this.storeId);

        if (id == "") {
            id = 1;
            storeService.update(this.storeId, id);

        } else {
            id = parseInt(id) + 1;
            storeService.update(this.storeId, id);
        }
        return id;

    }

    this.add = function (data) {

        var store_list = this.all();
        data.id = this.getId();
        var new_store = this.refine(data);

        if (new_store.status) {
            store_list.push(new_store.data);
            storeService.update(this.storeTitle, store_list);
        }
    }

    this.update = function (id, data) {

        var store_list = this.all();
        var index = store_list.getObj('id', id).index;

        var edited_store = this.refine(data);
        if (edited_store.status) {
            store_list[index] = edited_store.data;
            storeService.update(this.storeTitle, store_list);
        }
    }

    this.delete = function (id) {
        var store_list = this.all();
        var index = store_list.getObj('id', id).index;

        store_list.splice(index, 1);
        storeService.update(this.storeTitle, store_list);
    }

    this.refine = function (data) {

        if (isNaN(data.amount)) {
            return {status: false}
        }

        return {
            status: true,
            data: {id: data.id, title: data.title, amount: data.amount}
        };
    }

    this.setDefault = function () {
        // bank list
        var store_list = [
            {id: 1, title: "CV", amount: "3000"},
            {id: 2, title: "XL", amount: "4000"},
        ];
        storeService.update(this.storeTitle, store_list);
        storeService.update(this.storeId, 2);
    }

    // Custom
    this.updateBalance = function (bankId, amount, type) {

        if (isNaN(amount)) {
            return false;
        }

        var store_list = this.all();
        var obj = store_list.getObj('id', bankId);


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

        this.update(data.id, data);

    }

    this.balance = function (id) {
        var bank = this.all().getObj('id', id);
        return bank.data.amount;
    }

});

