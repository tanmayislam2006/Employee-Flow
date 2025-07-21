import { use } from "react"
import EmployeeFlowContext from "../Context/EmployeeFlowContext"

const useAuthProvidor =()=>{
    const sharedData =use(EmployeeFlowContext)
    return sharedData
}
export default useAuthProvidor