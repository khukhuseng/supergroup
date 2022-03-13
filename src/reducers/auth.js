import { LOGIN, LOGOUT } from "./actions";

const defaultState = {
    agentID: null,
    session: null,
    deviceID: null,
    onesignalID: null,
   
};

const authReducer = (state: any = defaultState, action: any) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                ...{
                    agentID: action.agentID,
                    session: action.session,
                    deviceID: action.deviceID,
                    onesignalID: action.onesignalID,

                }
            }
        case LOGOUT:
            return {
                ...state,
                agentID: null,
                session: null,
                deviceID: null,
                onesignalID: null,
            }
        default:
            return state
    }
}

export default authReducer;