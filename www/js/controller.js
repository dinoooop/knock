app.controller('testCtrl', function ($scope, $state, $ionicModal, $ionicPopup, bankService, transactionService, moderator) {

    if (0) {
        bankService.setDefault();
        transactionService.setDefault();
    }

});

app.controller('homeCtrl', function ($scope, $state, bankService, moderator) {

    moderator.loadDefault();

    $scope.banks = bankService.all();

    //Default
    $scope.fd = {
        the_bank: moderator.setLastBank(),
        the_type: "debit",
    };

    $scope.makeTransaction = function (fd) {
        moderator.makeTransaction(fd)
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

app.controller('transactionCtrl', function ($scope, moderator, $timeout, $ionicActionSheet, bankService, transactionService, bankTitle) {

    $scope.bankTitle = bankTitle;

    $scope.allTransactions = transactionService.all();
    $scope.bankTransactions = $scope.allTransactions.getObjs('bank', bankTitle);
    $scope.balance = bankService.balance(bankTitle);

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
                $scope.allTransactions = transactionService.all();
                $scope.bankTransactions = $scope.allTransactions.getObjs('bank', bankTitle);
                $scope.balance = bankService.balance(bankTitle);

                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
            hideSheet();
        }, 3000);

    };
});