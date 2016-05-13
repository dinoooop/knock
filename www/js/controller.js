
app.controller('sidebarCtrl', function ($scope, appConfig) {
    $scope.display = appConfig.developmentMode;
});

app.controller('testCtrl', function ($scope, $state, $ionicModal, $ionicPopup, bankService, transactionService, moderator) {

    moderator.loadDefault();

});

app.controller('homeCtrl', function ($scope, $state, bankService, moderator) {

    moderator.loadDefault();
    $scope.banks = bankService.all();

    //Default
    $scope.fd = {
        the_bank_id: moderator.getLastBank(),
        the_type: "debit",
    };

    $scope.submitTransaction = function (fd) {
        
        
        if (typeof fd.the_amount == "undefined" || isNaN(fd.the_amount)) {
            alert("Please enter an amount!");
            return false;
        }

        var balance = bankService.balance(fd.the_bank_id);

        if (balance < fd.the_amount) {
            alert("You haven't sufficient amount to make this transaction");
            return false;
        }

        var data = {amount: fd.the_amount, bank_id: fd.the_bank_id, type: fd.the_type};
        moderator.makeTransaction(data)
        $scope.fd.the_amount = "";
    }

});

app.controller('bankCtrl', function ($scope, moderator, $timeout, $ionicActionSheet, $ionicModal, bankService) {

    $scope.banks = bankService.all();

    // Model - Create Bank
    $ionicModal.fromTemplateUrl('templates/model-create-bank.html', function (modal) {
        $scope.modelCB = modal;
    }, {
        scope: $scope
    });

    $scope.showModelCB = function () {
        $scope.modelCB.show();
    }

    $scope.closeModelCB = function () {
        $scope.modelCB.hide();
    }

    $scope.createBank = function (fd) {
        var data = {amount: fd.the_amount, title: fd.the_title};
        bankService.add(data);
        $scope.banks = bankService.all();
        $scope.modelCB.hide();
    }

    // Model - Edit Bank
    $ionicModal.fromTemplateUrl('templates/model-edit-bank.html', function (modal) {
        $scope.modelEB = modal;
    }, {
        scope: $scope
    });

    $scope.showmodelEB = function (bankId) {

        var data = bankService.get(bankId);

        $scope.fd = {
            the_id: data.id,
            the_title: data.title,
            the_amount: data.amount,
        }
        $scope.modelEB.show();
    }

    $scope.closemodelEB = function () {
        $scope.modelEB.hide();
    }

    $scope.updateBank = function (fd) {

        $scope.fd = {};
        moderator.updateBank(fd);
        $scope.banks = bankService.all();
        $scope.modelEB.hide();
    }

    $scope.hold = function (bankId) {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                {text: 'Edit'},
                {text: 'Transactions'},
            ],
            destructiveText: 'Delete',
            titleText: 'Modify your banks',
            cancelText: 'Cancel',
            cancel: function () {

            },
            buttonClicked: function (index) {
                if (index === 0) {
                    // Edit option
                    $scope.showmodelEB(bankId);
                }
                return true;
            },
            destructiveButtonClicked: function () {
                moderator.deleteTheBank(bankId)
                $scope.banks = bankService.all();
                return true;
            }
        });

        // Hide the sheet after three seconds
        $timeout(function () {
            hideSheet();
        }, 3000);

    };

});

app.controller('transactionCtrl', function ($scope, moderator, $timeout, $ionicActionSheet, bankService, transactionService, bankId) {

    var theBank = bankService.get(bankId);

    $scope.bankTitle = theBank.title;
    $scope.bankTransactions = transactionService.getAllTransactionsOfBank(bankId);
    $scope.balance = bankService.balance(bankId);

    $scope.hold = function (transactionId) {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
            ],
            destructiveText: 'Delete',
            titleText: 'Modify transaction',
            cancelText: 'Cancel',
            cancel: function () {

            },
            buttonClicked: function (index) {
                if (index === 0) {
                    // Edit option
                    $scope.showmodelEB(transactionId);
                }
                return true;
            },
            destructiveButtonClicked: function () {

                moderator.deleteTheTransaction(transactionId)

                //reset values
                $scope.bankTransactions = transactionService.getAllTransactionsOfBank(bankId);
                $scope.balance = bankService.balance(bankId);

                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
            hideSheet();
        }, 3000);

    };
});

app.controller('jsonCtrl', function ($scope, bankService, transactionService) {
    $scope.banks = bankService.all();
    $scope.transactions = transactionService.all();
});