app.controller('testCtrl', function ($scope, $state, $ionicModal, $ionicPopup, bankService, transactionService, moderator) {

    if (0) {
        bankService.setDefault();
        transactionService.setDefault();
    }

    var banks = bankService.all();
    var transactions = transactionService.all();

    console.log(JSON.stringify(banks));
    console.log(JSON.stringify(transactions));

});

app.controller('homeCtrl', function ($scope, $state, $ionicModal, $ionicPopup, bankService, transactionService) {

//    bankService.setDefault();
//    transactionService.setDefault();
    $scope.banks = bankService.all();


    //Default
    $scope.cp = {
        the_bank: "XL",
        the_type: "debit",
    };


    // Checkbox window for banks

    $scope.createTransaction = function (cp) {
        var data = {amount: cp.the_amount, bank: cp.the_bank, type: cp.the_type};
        transactionService.add(data);
        bankService.updateBalance(data.bank, data.amount, data.type);
        $state.go('app.bank');
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

    $scope.showModal = function () {
        $scope.modelCB.show();
    }

    $scope.closeModel = function () {
        $scope.modelCB.hide();
    }

    // Model - Edit Bank
    $ionicModal.fromTemplateUrl('templates/model-edit-bank.html', function (modal) {
        $scope.modelEB = modal;
    }, {
        scope: $scope
    });

    $scope.showmodelEB = function (bankId) {
        $scope.fd = {
            bankId: bankId,
            the_title: $scope.banks[bankId].title,
            the_amount: $scope.banks[bankId].amount,
        }
        $scope.modelEB.show();
    }

    $scope.closemodelEB = function () {
        $scope.modelEB.hide();
    }

    $scope.createBank = function (fd) {
        var data = {amount: fd.the_amount, title: fd.the_title};
        bankService.add(data);
        $scope.banks = bankService.all();
        $scope.modelCB.hide();
    }

    $scope.updateBank = function (fd) {
        $scope.fd = {};
        var data = {amount: fd.the_amount, title: fd.the_title};
        bankService.update(fd.bankId, data);
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

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
            hideSheet();
        }, 3000);

    };

});

app.controller('transactionCtrl', function ($scope, bankService, transactionService, bankTitle) {
    $scope.bankTitle = bankTitle;
    $scope.allTransactions = transactionService.all();
    $scope.bankTransactions = $scope.allTransactions.getObjs('bank', bankTitle);
    $scope.balance = bankService.balance(bankTitle);
});
