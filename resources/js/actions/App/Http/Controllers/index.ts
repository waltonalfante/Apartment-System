import ApartmentModuleController from './ApartmentModuleController'
import Settings from './Settings'
import Api from './Api'
const Controllers = {
    ApartmentModuleController: Object.assign(ApartmentModuleController, ApartmentModuleController),
Settings: Object.assign(Settings, Settings),
Api: Object.assign(Api, Api),
}

export default Controllers