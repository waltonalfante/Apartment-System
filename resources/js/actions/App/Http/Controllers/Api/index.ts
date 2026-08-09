import AuthApiController from './AuthApiController'
import OtpController from './OtpController'
import PasswordController from './PasswordController'
import AnnouncementController from './AnnouncementController'
import EmailController from './EmailController'
const Api = {
    AuthApiController: Object.assign(AuthApiController, AuthApiController),
OtpController: Object.assign(OtpController, OtpController),
PasswordController: Object.assign(PasswordController, PasswordController),
AnnouncementController: Object.assign(AnnouncementController, AnnouncementController),
EmailController: Object.assign(EmailController, EmailController),
}

export default Api