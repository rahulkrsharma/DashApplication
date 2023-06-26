export enum SignInValidation {

    SignInSuccessful = 1,
    EmailIdNotRegistered = 2,
    PasswordNotCorrect = 3,
    AccountNotActive=4,
    ErrorOcccured =0

}
export enum RegisterValidation {

    AccountNotActive = 1,
    ErrorOcccured =0,
    AlreadyRegistered = 2,
}