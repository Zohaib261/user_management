import React, {lazy,Component } from 'react'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

class Dashboard extends Component {

    constructor(props) {
        super(props);
        const user_detail = localStorage.getItem("userDetail");
        if(user_detail !== null){
            const user_parse_data = JSON.parse(user_detail);
            const isVerify = user_parse_data.isVerify;
    
            if(isVerify === '0'){
                window.open('http://localhost:3000/#/loginVeriy',"_self");
            }
        }else{
            window.open('http://localhost:3000/#/login',"_self");
        }
    }

    
    render(){
        return (
            <>
            <WidgetsDropdown />
        

            </>
        )
    }
}

export default Dashboard
