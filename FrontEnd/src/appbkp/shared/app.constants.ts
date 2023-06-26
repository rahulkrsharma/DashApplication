export class AppConstants {


    public static get baseUrl():string { return 'http://dashapi-test.us-east-1.elasticbeanstalk.com'; }

    //public static get baseUrl():string { return 'https://localhost:44389'; }
    
    public static get loginUrl():string { return this.baseUrl + '/UserAuth/SignIn'};

    public static get registerUrl():string { return this.baseUrl + '/UserAuth/Register'};

    public static get resetPasswordUrl():string { return this.baseUrl + '/UserAuth/ResetPassword'};

    public static get sendVercodeUrl():string { return this.baseUrl + '/UserAuth/SendResetPasswordVerification/'};

    public static get projectListUrl():string { return this.baseUrl + '/ProjectPricing/ProjectsList'};

    public static get pricingFilesUrl():string { return this.baseUrl + '/ProjectPricing/PricingFiles'};
    
    public static get fetchUsersListUrl():string { return this.baseUrl + '/UserAuth/UsersList'};

    public static get fetchUserInfoUrl():string { return this.baseUrl + '/UserAuth/UserInfo/'};

    public static get fetchQuarterlyDataUrl():string { return this.baseUrl + '/ProjectPricing/FetchQuarterlyAllocation/'};
    
    public static get resourceWorkUrl():string { return this.baseUrl + '/ProjectPricing/FetchResourceWork'};
    
    
    public static get projectDetailsByIdUrl():string { return this.baseUrl + '/ProjectPricing/FetchProjectDetailsById/'};

    public static get fetchRateUrl():string { return this.baseUrl + '/ProjectPricing/Rates/'};

    public static get leavesDetailUrl():string { return this.baseUrl + '/ProjectPricing/LeavesDetail/'};

    

    public static get saveProjectPricingUrl():string { return this.baseUrl + '/ProjectPricing/SaveProjectPricing'};
    
    public static get saveRatesUrl():string { return this.baseUrl + '/ProjectPricing/SaveRates'};

    public static get manageLeavesUrl():string { return this.baseUrl + '/ProjectPricing/ManageLeaves'};
    
    public static get salesForecastUrl():string { return this.baseUrl + '/ProjectPricing/FetchSalesForecast'};
    
    public static get managerUserDetailsUrl():string { return this.baseUrl + '/UserAuth/ManageUser'};

    public static get saveExpenseTypesUrl():string { return this.baseUrl + '/ProjectPricing/SaveExpense'};

    public static get saveServiceTypesUrl():string { return this.baseUrl + '/ProjectPricing/SaveService'};

    public static get stockListUrl():string { return this.baseUrl + '/api/Dashboard/StocksList'};

    public static get stockListByFiltersUrl():string { return this.baseUrl + '/api/Dashboard/StocksListByFilters/'};


    public static get searchStockByTickerOrISINUrl():string { return this.baseUrl + '/api/Dashboard/SearchStockByTickerOrISIN/'};

    public static get privateStockUrl():string { return this.baseUrl + '/api/Dashboard/PrivateStock'};

    public static get userGoalUrl():string { return this.baseUrl + '/api/Dashboard/SaveUserGoal'};

    public static get bookmarkUrl():string { return this.baseUrl + '/api/Dashboard/StockBookmark'};

    public static get activateAccountUrl():string { return this.baseUrl + '/UserAuth/ActivateAccount/'};

    public static get saveAssetsUrl():string { return this.baseUrl + '/api/Dashboard/SaveAssetsOverview'};

    public static get savecostIncomeUrl():string { return this.baseUrl + '/api/Dashboard/SaveCostIncomeCalculation'};

    public static get retrieveAssetsDetailUrl():string { return this.baseUrl + '/api/Dashboard/AssetOverviewDetails/'};

    public static get paymentDetailUrl():string { return this.baseUrl + '/api/Dashboard/GetPaymentDetails/'};
}